import psycopg2
import psycopg2.extras
import csv
import json
from datetime import datetime

DSN = "postgresql://postgres:eTtN0IUIa53eUDY4@db.hgloedsnmpntnohvxhie.supabase.co:5432/postgres"
CSV_PATH = "/Users/ahmedalfakih/Desktop/Avelix/avelix_models_import.csv"
REPORT_DIR = "/Users/ahmedalfakih/Desktop/Avelix"

print("=" * 60)
print("AVELIX MODELS IMPORT")
print("=" * 60)

VALID_CATEGORIES = {
    "Language", "Reasoning", "Coding", "Vision", "Multimodal",
    "Audio", "Video", "Image Generation", "Embeddings", "Agents", "Safety", "On-Device"
}

# Columns intentionally mapped (used in map_row)
MAPPED_CSV_COLS = {
    "avelix_slug", "avelix_display_name", "avelix_category", "avelix_featured",
    "avelix_tags", "avelix_data_flags", "popularity_tier", "confidence_score",
    "avelix_overview", "Provider name", "provider_logo_url",
    "Provider country or region", "provider_country_norm",
    "Model family", "Model name", "Model version", "release_year", "Release date",
    "Latest known version", "Status", "status_norm", "model_type_norm", "modality_norm",
    "Input types", "Output types", "Context window", "max_output_tokens",
    "parameter_count", "Supported languages", "open_source_norm",
    "proprietary_model_index", "License type", "API availability", "has_free_tier",
    "Deployment options", "Official model URL", "Documentation URL", "Pricing URL",
    "Model card URL", "GitHub or Hugging Face URL", "consumer_url", "Source links",
    "price_summary", "api_input_price_usd_per_1m", "api_output_price_usd_per_1m",
    "price_status", "pricing_tier_label", "Cost profile", "Key capabilities",
    "Limitations", "Best use cases", "Not recommended use cases", "similar_cheaper_model",
    "Tool use support", "Function calling support", "Structured output support",
    "JSON mode support", "Vision support", "Audio support", "Video support",
    "Image generation support", "Fine-tuning support", "RAG suitability",
    "Embedding support", "avg_response_latency", "Latency profile",
    "Benchmark results", "Enterprise readiness", "Compliance or security notes",
    "Safety features", "Training data notes", "Known integrations",
    "Primary competitors", "example_prompt_1", "example_prompt_2", "example_prompt_3",
    "Last verified date"
}


def to_bool(val, null_if_unknown=False):
    if val is None:
        return None
    v = str(val).strip().lower()
    if v in ("yes", "true", "1"):
        return True
    if v in ("no", "false", "0"):
        return False
    if null_if_unknown:
        return None
    return False


def to_float(val):
    if val is None or str(val).strip() in ("", "unknown", "n/a", "nan", "-"):
        return None
    try:
        return float(str(val).strip().replace(",", ""))
    except Exception:
        return None


def to_int(val):
    if val is None or str(val).strip() in ("", "unknown", "n/a", "nan", "-"):
        return None
    try:
        return int(float(str(val).strip().replace(",", "")))
    except Exception:
        return None


def to_date(val):
    if val is None or str(val).strip() in ("", "unknown", "n/a", "nan", "-"):
        return None
    s = str(val).strip()
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%Y/%m/%d",
                "%B %d, %Y", "%b %d, %Y", "%Y"):
        try:
            return datetime.strptime(s, fmt).date().isoformat()
        except Exception:
            pass
    return None


def to_array(val):
    if val is None or str(val).strip() in ("", "unknown", "n/a", "nan", "-", "{}"):
        return []
    s = str(val).strip()
    if s.startswith("{") and s.endswith("}"):
        s = s[1:-1]
    parts = [p.strip().strip('"').strip("'") for p in s.split(",") if p.strip()]
    return [p for p in parts if p]


def clamp(v, lo=0.0, hi=1.0):
    if v is None:
        return v
    return max(lo, min(hi, v))


# ── Read CSV ──────────────────────────────────────────────────
print(f"\nReading CSV...")
with open(CSV_PATH, newline="", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    rows = list(reader)
    csv_cols = list(reader.fieldnames)

print(f"CSV: {len(rows)} rows, {len(csv_cols)} columns")

# ── STEP 3: Pre-import validation ────────────────────────────
print("\n" + "=" * 60)
print("STEP 3: Pre-import validation")
print("=" * 60)

# 1. Slug uniqueness
slugs_seen = {}
for i, row in enumerate(rows):
    slug = (row.get("avelix_slug") or "").strip()
    if slug not in slugs_seen:
        slugs_seen[slug] = []
    slugs_seen[slug].append(i)

dup_slugs = {s: idxs for s, idxs in slugs_seen.items() if len(idxs) > 1}
if dup_slugs:
    print(f"WARNING: {len(dup_slugs)} duplicate slugs — deduplicating...")
    counters = {}
    for row in rows:
        slug = (row.get("avelix_slug") or "").strip()
        if slug in dup_slugs:
            counters[slug] = counters.get(slug, 0) + 1
            if counters[slug] > 1:
                row["avelix_slug"] = f"{slug}-{counters[slug]}"
else:
    print(f"OK: all {len(rows)} slugs unique")

# 2. Enum corrections
enum_corrections = []
for row in rows:
    cat = (row.get("avelix_category") or "").strip()
    if cat and cat not in VALID_CATEGORIES:
        matched = next((v for v in VALID_CATEGORIES if v.lower() == cat.lower()), None)
        if matched:
            row["avelix_category"] = matched
            enum_corrections.append(f"{row.get('avelix_slug')}: '{cat}' -> '{matched}'")
        else:
            row["avelix_category"] = "Language"
            enum_corrections.append(f"{row.get('avelix_slug')}: '{cat}' -> 'Language' (no match)")

if enum_corrections:
    print(f"WARNING: {len(enum_corrections)} avelix_category corrections")
    for c in enum_corrections[:5]:
        print(f"  {c}")
else:
    print("OK: all avelix_category values valid")

# 3. Confidence score clamp
clamped_count = 0
for row in rows:
    v = to_float(row.get("confidence_score"))
    if v is not None and (v < 0.0 or v > 1.0):
        row["confidence_score"] = str(clamp(v))
        clamped_count += 1

print(f"Clamped confidence_score: {clamped_count} rows")

# 4. Required fields
skipped_reasons = {}
for row in rows:
    missing = []
    for field in ("avelix_slug", "Model name", "Provider name"):
        if not (row.get(field) or "").strip():
            missing.append(field)
    if missing:
        slug = row.get("avelix_slug") or "[no-slug]"
        skipped_reasons[slug] = f"Missing: {missing}"

print(f"Skipped (missing required fields): {len(skipped_reasons)}")
for slug, reason in list(skipped_reasons.items())[:5]:
    print(f"  {slug}: {reason}")

print(f"\nPre-import summary:")
print(f"  Total rows: {len(rows)}")
print(f"  Will attempt: {len(rows) - len(skipped_reasons)}")
print(f"  Skipped: {len(skipped_reasons)}")

# 5. Check existing slugs in DB
print("\nConnecting to Supabase Postgres...")
conn = psycopg2.connect(DSN, connect_timeout=15)
conn.autocommit = True
cur = conn.cursor()
print("Connected.")

cur.execute("SELECT slug FROM models")
existing_slugs = {r[0] for r in cur.fetchall()}
print(f"Existing models in DB: {len(existing_slugs)}")

overlap = [row.get("avelix_slug") for row in rows if row.get("avelix_slug") in existing_slugs]
if overlap:
    print(f"UPSERT overlaps ({len(overlap)} slugs will be updated):")
    for s in overlap[:5]:
        print(f"  {s}")
else:
    print("No slug conflicts — all rows are new inserts")

# Get live DB column list
cur.execute("""
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'models' ORDER BY ordinal_position
""")
db_cols = {r[0] for r in cur.fetchall()}
print(f"\nDB columns available: {len(db_cols)}")

# Unmapped CSV columns
unmapped_csv = [c for c in csv_cols if c not in MAPPED_CSV_COLS]
print(f"Unmapped CSV columns (will be skipped): {unmapped_csv}")


# pricing_enum allowed: free | freemium | paid | open-source | enterprise
def _to_pricing_enum(val):
    if not val:
        return None
    v = str(val).strip().lower()
    if v in ("free",):
        return "free"
    if v in ("freemium",):
        return "freemium"
    if v in ("open source / free", "open-source", "open source", "open_source"):
        return "open-source"
    if v in ("enterprise",):
        return "enterprise"
    if v in ("budget", "mid-range", "premium", "paid"):
        return "paid"
    # unknown / anything else → null (column is nullable)
    return None


# ── Row mapper ────────────────────────────────────────────────
def map_row(row):
    def s(k):
        v = row.get(k)
        if v is None:
            return None
        v = str(v).strip()
        return v if v else None

    def cap_bool(k):
        v = s(k)
        if v is None:
            return False
        return v.lower() == "yes"

    r = {
        "slug":               s("avelix_slug"),
        "title":              s("avelix_display_name") or s("Model name"),
        "provider":           s("Provider name"),
        "short_description":  (s("avelix_overview") or "")[:300] or None,
        "long_description":   s("avelix_overview"),
        "status":             "published",
        "ai_generated":       "ai_generated:true" in (s("avelix_data_flags") or "").lower(),
        # avelix enriched
        "avelix_category":    s("avelix_category"),
        "avelix_featured":    to_bool(s("avelix_featured")),
        "avelix_tags":        to_array(s("avelix_tags")),
        "avelix_data_flags":  s("avelix_data_flags"),
        "popularity_tier":    s("popularity_tier"),
        "confidence_score":   clamp(to_float(s("confidence_score"))) if to_float(s("confidence_score")) is not None else 0.5,
        # provider
        "provider_country":   s("provider_country_norm") or s("Provider country or region"),
        "model_family":       s("Model family"),
        "model_version":      s("Model version") or s("Latest known version"),
        "model_type_detail":  s("model_type_norm"),
        "modality":           s("modality_norm"),
        # model info
        "model_type":         s("model_type_norm") or "Unknown",
        "release_date":       to_date(s("Release date")),
        "release_year":       to_int(s("release_year")),
        "current_status":     s("status_norm") or s("Status") or "Active",
        "context_window":     to_int(s("Context window")),
        "max_output_tokens":  to_int(s("max_output_tokens")),
        "parameter_count":    s("parameter_count"),
        "is_open_source":     (s("open_source_norm") or "").lower() == "open source",
        # access
        "has_api":            cap_bool("API availability"),
        "has_free_tier":      to_bool(s("has_free_tier"), null_if_unknown=True) or False,
        "deployment_options": to_array(s("Deployment options")),
        # URLs
        "official_source_url": s("Official model URL"),
        "documentation_url":   s("Documentation URL"),
        "pricing_url":         s("Pricing URL"),
        "model_card_url":      s("Model card URL"),
        "github_hf_url":       s("GitHub or Hugging Face URL"),
        "consumer_url":        s("consumer_url"),
        "source_urls":         to_array(s("Source links")),
        # pricing — pricing_model must be a pricing_enum value
        "pricing_summary":    s("price_summary") or s("Cost profile"),
        "pricing_model":      _to_pricing_enum(s("pricing_tier_label") or s("price_status")),
        "pricing_tier_label": s("pricing_tier_label"),
        "pricing_last_verified": to_date(s("Last verified date")),
        "api_input_price_usd_per_1m":  to_float(s("api_input_price_usd_per_1m")),
        "api_output_price_usd_per_1m": to_float(s("api_output_price_usd_per_1m")),
        # capabilities text
        "strengths":     to_array(s("Key capabilities")),
        "weaknesses":    to_array(s("Limitations")),
        "best_for":      to_array(s("Best use cases")),
        "not_ideal_for": to_array(s("Not recommended use cases")),
        "use_cases":     to_array(s("Best use cases")),
        "similar_cheaper_model": s("similar_cheaper_model"),
        "quality_notes":         s("Benchmark results"),
        "benchmark_results":     s("Benchmark results"),
        # capability booleans
        "tool_use_support":          cap_bool("Tool use support"),
        "structured_output_support": cap_bool("Structured output support"),
        "json_mode_support":         cap_bool("JSON mode support"),
        "vision_support":            cap_bool("Vision support"),
        "audio_support":             cap_bool("Audio support"),
        "video_support":             cap_bool("Video support"),
        "image_generation_support":  cap_bool("Image generation support"),
        "fine_tuning_support":       cap_bool("Fine-tuning support"),
        "embedding_support":         cap_bool("Embedding support"),
        "rag_suitability":           s("RAG suitability"),
        "enterprise_ready":          cap_bool("Enterprise readiness"),
        # performance
        "avg_response_latency": s("avg_response_latency") or s("Latency profile"),
        "speed":       s("avg_response_latency") or s("Latency profile"),
        "speed_notes": s("Latency profile"),
        # safety
        "safety_notes":    s("Compliance or security notes"),
        "safety_features": s("Safety features"),
        # ecosystem
        "known_integrations":  s("Known integrations"),
        "primary_competitors": s("Primary competitors"),
        # example prompts
        "example_prompts": [x for x in [s("example_prompt_1"), s("example_prompt_2"), s("example_prompt_3")] if x],
        # tags
        "tags": to_array(s("avelix_tags")),
        # timestamps
        "published_at":     datetime.utcnow().isoformat(),
        "last_reviewed_at": to_date(s("Last verified date")) or datetime.utcnow().isoformat(),
    }
    # Only keep columns that exist in DB
    return {k: v for k, v in r.items() if k in db_cols}


# ── STEP 4: Import in batches of 50 ──────────────────────────
print("\n" + "=" * 60)
print("STEP 4: Import")
print("=" * 60)

to_import = [row for row in rows if row.get("avelix_slug", "") not in skipped_reasons]
BATCH_SIZE = 50
batches = [to_import[i:i + BATCH_SIZE] for i in range(0, len(to_import), BATCH_SIZE)]

failed_rows = []
success_count = 0
upsert_count = 0

for b_idx, batch in enumerate(batches):
    start_row = b_idx * BATCH_SIZE + 1
    end_row = min((b_idx + 1) * BATCH_SIZE, len(to_import))
    print(f"Importing batch {b_idx + 1} of {len(batches)} — rows {start_row} to {end_row}...", end=" ", flush=True)

    mapped_batch = []
    for row in batch:
        try:
            mapped_batch.append(map_row(row))
        except Exception as e:
            slug = row.get("avelix_slug", "?")
            failed_rows.append((slug, f"mapping error: {e}"))

    if not mapped_batch:
        print("(all mapping failed)")
        continue

    cols = list(mapped_batch[0].keys())
    col_str = ", ".join(f'"{c}"' for c in cols)
    placeholders = ", ".join(f"%({c})s" for c in cols)
    update_str = ", ".join(
        f'"{c}" = EXCLUDED."{c}"' for c in cols if c not in ("id", "slug", "created_at")
    )
    upsert_sql = f"""
        INSERT INTO models ({col_str})
        VALUES ({placeholders})
        ON CONFLICT (slug) DO UPDATE SET {update_str}
    """

    try:
        psycopg2.extras.execute_batch(cur, upsert_sql, mapped_batch, page_size=50)
        success_count += len(mapped_batch)
        upsert_count += sum(1 for r in mapped_batch if r.get("slug") in existing_slugs)
        print(f"OK ({len(mapped_batch)} rows)")
    except Exception as e:
        print(f"FAILED")
        err_msg = str(e)[:300]
        print(f"  Error: {err_msg}")
        for r in mapped_batch:
            failed_rows.append((r.get("slug", "?"), err_msg))

cur.close()
conn.close()

# ── STEP 5: Post-import verification ─────────────────────────
print("\n" + "=" * 60)
print("STEP 5: Post-import verification")
print("=" * 60)

conn2 = psycopg2.connect(DSN, connect_timeout=15)
cur2 = conn2.cursor()

cur2.execute("SELECT COUNT(*) FROM models WHERE status = 'published'")
published = cur2.fetchone()[0]

cur2.execute("SELECT COUNT(*) FROM models")
total = cur2.fetchone()[0]

cur2.execute("SELECT COUNT(*) FROM models WHERE confidence_score IS NULL")
null_cs = cur2.fetchone()[0]

cur2.execute("SELECT COUNT(*) FROM models WHERE slug IS NULL OR slug = ''")
null_slug = cur2.fetchone()[0]

cur2.execute("SELECT avelix_category, COUNT(*) FROM models GROUP BY avelix_category ORDER BY COUNT(*) DESC")
cat_breakdown = cur2.fetchall()

cur2.execute("SELECT is_open_source, COUNT(*) FROM models GROUP BY is_open_source")
os_breakdown = cur2.fetchall()

cur2.execute("SELECT pricing_tier_label, COUNT(*) FROM models GROUP BY pricing_tier_label ORDER BY COUNT(*) DESC")
price_breakdown = cur2.fetchall()

cur2.execute("SELECT slug, title, provider, avelix_category, confidence_score, status FROM models ORDER BY RANDOM() LIMIT 5")
sample_rows = cur2.fetchall()

cur2.close()
conn2.close()

print(f"Published models:          {published}")
print(f"Total models in table:     {total}")
print(f"NULL confidence_score:     {null_cs}")
print(f"NULL/empty slug:           {null_slug}")

print("\nBy avelix_category:")
for cat, cnt in cat_breakdown:
    print(f"  {cat or 'NULL'}: {cnt}")

print("\nBy open_source (is_open_source):")
for flag, cnt in os_breakdown:
    print(f"  {'Open Source' if flag else 'Closed Source'}: {cnt}")

print("\nBy pricing_tier_label:")
for label, cnt in price_breakdown:
    print(f"  {label or 'NULL'}: {cnt}")

print("\nSample 5 random rows:")
for row in sample_rows:
    print(f"  {row[0]} | {row[1]} | {row[2]} | {row[3]} | conf={row[4]} | {row[5]}")

# ── STEP 6: Write report ──────────────────────────────────────
now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

report_lines = [
    "AVELIX MODELS IMPORT REPORT",
    "=" * 40,
    f"Import date/time: {now_str}",
    "",
    "SUMMARY",
    "-" * 40,
    f"Total rows in CSV:               {len(rows)}",
    f"Total rows attempted:            {len(to_import)}",
    f"Total successfully imported:     {success_count}",
    f"  of which updated (upsert):     {upsert_count}",
    f"  of which new inserts:          {success_count - upsert_count}",
    f"Total skipped (missing fields):  {len(skipped_reasons)}",
    f"Total failed (import errors):    {len(failed_rows)}",
    "",
    "SKIPPED ROWS",
    "-" * 40,
]
for slug, reason in skipped_reasons.items():
    report_lines.append(f"  {slug}: {reason}")
if not skipped_reasons:
    report_lines.append("  (none)")

report_lines += ["", "FAILED ROWS", "-" * 40]
for slug, err in failed_rows:
    report_lines.append(f"  {slug}: {err}")
if not failed_rows:
    report_lines.append("  (none)")

report_lines += [
    "",
    "POST-IMPORT COUNTS",
    "-" * 40,
    f"Published models:      {published}",
    f"Total in table:        {total}",
    f"NULL confidence_score: {null_cs}",
    f"NULL slug:             {null_slug}",
    "",
    "BY CATEGORY",
    "-" * 40,
]
for cat, cnt in cat_breakdown:
    report_lines.append(f"  {cat or 'NULL'}: {cnt}")

report_lines += ["", "BY OPEN SOURCE", "-" * 40]
for flag, cnt in os_breakdown:
    report_lines.append(f"  {'Open Source' if flag else 'Closed Source'}: {cnt}")

report_lines += ["", "BY PRICING TIER", "-" * 40]
for label, cnt in price_breakdown:
    report_lines.append(f"  {label or 'NULL'}: {cnt}")

report_lines += ["", "ENUM CORRECTIONS", "-" * 40]
for c in enum_corrections:
    report_lines.append(f"  {c}")
if not enum_corrections:
    report_lines.append("  (none)")

report_lines += ["", "UNMAPPED CSV COLUMNS (skipped)", "-" * 40]
for c in unmapped_csv:
    report_lines.append(f"  {c}")
if not unmapped_csv:
    report_lines.append("  (none)")

report_text = "\n".join(report_lines)

with open(f"{REPORT_DIR}/import_report.txt", "w") as f:
    f.write(report_text)

if skipped_reasons:
    with open(f"{REPORT_DIR}/skipped_models.txt", "w") as f:
        f.write("\n".join(skipped_reasons.keys()))

if failed_rows:
    with open(f"{REPORT_DIR}/failed_models.txt", "w") as f:
        f.write("\n".join(slug for slug, _ in failed_rows))

print("\n" + "=" * 60)
print("IMPORT COMPLETE")
print("=" * 60)
print(f"Imported:  {success_count} / {len(to_import)}")
print(f"Skipped:   {len(skipped_reasons)}")
print(f"Failed:    {len(failed_rows)}")
print(f"Report:    {REPORT_DIR}/import_report.txt")
