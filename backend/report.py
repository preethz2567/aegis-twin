import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

PAGE_W, PAGE_H = A4
MARGIN = 2.2 * cm

# ── Colour palette (matches dashboard dark theme tone, but on white paper)
DARK_SLATE  = colors.HexColor("#1A1A2E")
ACCENT      = colors.HexColor("#00B4D8")
MUTED       = colors.HexColor("#6B7280")
RISK_RED    = colors.HexColor("#EF4444")
SAFE_GREEN  = colors.HexColor("#10B981")
BORDER_GREY = colors.HexColor("#D1D5DB")
ROW_ALT     = colors.HexColor("#F9FAFB")


def _styles():
    base = getSampleStyleSheet()
    styles = {
        "title": ParagraphStyle(
            "ReportTitle",
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=26,
            textColor=DARK_SLATE,
            spaceAfter=4,
        ),
        "subtitle": ParagraphStyle(
            "ReportSubtitle",
            fontName="Helvetica",
            fontSize=10,
            textColor=MUTED,
            spaceAfter=20,
        ),
        "section": ParagraphStyle(
            "SectionHeader",
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=18,
            textColor=DARK_SLATE,
            spaceBefore=18,
            spaceAfter=8,
            borderPad=4,
        ),
        "body": ParagraphStyle(
            "BodyText",
            fontName="Helvetica",
            fontSize=10,
            leading=15,
            textColor=colors.HexColor("#374151"),
            spaceAfter=8,
        ),
        "footer": ParagraphStyle(
            "Footer",
            fontName="Helvetica",
            fontSize=8,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
        "th": ParagraphStyle(
            "TableHeader",
            fontName="Helvetica-Bold",
            fontSize=9,
            textColor=colors.white,
            alignment=TA_LEFT,
        ),
        "td": ParagraphStyle(
            "TableCell",
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#374151"),
            alignment=TA_LEFT,
        ),
    }
    return styles


def _table_style(header_color=DARK_SLATE, alternating=True):
    ts = [
        # Header row
        ("BACKGROUND",  (0, 0), (-1, 0), header_color),
        ("TEXTCOLOR",   (0, 0), (-1, 0), colors.white),
        ("FONTNAME",    (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",    (0, 0), (-1, 0), 9),
        ("TOPPADDING",  (0, 0), (-1, 0), 7),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 7),
        # Body rows
        ("FONTNAME",    (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE",    (0, 1), (-1, -1), 9),
        ("TOPPADDING",  (0, 1), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 6),
        ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
        # Borders
        ("GRID",        (0, 0), (-1, -1), 0.4, BORDER_GREY),
        ("LINEBELOW",   (0, 0), (-1, 0),  0.8, header_color),
    ]
    if alternating:
        # Will be added row by row below
        pass
    return ts


def generate_pdf_report(attack_path_result: dict, fix_recommendations: dict, explanation_text: str) -> bytes:
    buf = io.BytesIO()
    now = datetime.now()
    ts_display = now.strftime("%B %d, %Y  %H:%M UTC")
    ts_filename = now.strftime("%Y%m%d_%H%M%S")

    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=MARGIN + 1 * cm,
        title="AEGIS-TWIN Security Assessment Report",
    )

    s = _styles()
    story = []

    # ── HEADER ────────────────────────────────────────────────────────────
    story.append(Paragraph("AEGIS-TWIN", ParagraphStyle(
        "Brand", fontName="Helvetica-Bold", fontSize=11,
        textColor=ACCENT, spaceAfter=2,
    )))
    story.append(Paragraph("Security Assessment Report", s["title"]))
    story.append(Paragraph(f"Generated: {ts_display}", s["subtitle"]))
    story.append(HRFlowable(width="100%", thickness=1.5, color=DARK_SLATE, spaceAfter=6))

    # ── RISK SCORE BANNER ─────────────────────────────────────────────────
    risk_score = attack_path_result.get("risk_score", "N/A")
    fixes = fix_recommendations.get("recommended_fixes", [])
    total_reduction = fix_recommendations.get("total_risk_reduction_percent", 0)
    projected = round(risk_score * (1 - total_reduction / 100), 2) if isinstance(risk_score, (int, float)) else "N/A"

    banner_data = [
        [
            Paragraph("ORIGINAL RISK SCORE", ParagraphStyle("bh", fontName="Helvetica-Bold", fontSize=8, textColor=MUTED)),
            Paragraph("PROJECTED RISK SCORE", ParagraphStyle("bh", fontName="Helvetica-Bold", fontSize=8, textColor=MUTED)),
            Paragraph("TOTAL RISK REDUCTION", ParagraphStyle("bh", fontName="Helvetica-Bold", fontSize=8, textColor=MUTED)),
        ],
        [
            Paragraph(str(risk_score), ParagraphStyle("bv", fontName="Helvetica-Bold", fontSize=18, textColor=RISK_RED)),
            Paragraph(str(projected),  ParagraphStyle("bv", fontName="Helvetica-Bold", fontSize=18, textColor=SAFE_GREEN)),
            Paragraph(f"{total_reduction}%", ParagraphStyle("bv", fontName="Helvetica-Bold", fontSize=18, textColor=ACCENT)),
        ],
    ]
    col_w = (PAGE_W - 2 * MARGIN) / 3
    banner = Table(banner_data, colWidths=[col_w, col_w, col_w])
    banner.setStyle(TableStyle([
        ("ALIGN",       (0, 0), (-1, -1), "CENTER"),
        ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING",  (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("BACKGROUND",  (0, 0), (-1, -1), ROW_ALT),
        ("BOX",         (0, 0), (-1, -1), 0.8, BORDER_GREY),
        ("LINEBEFORE",  (1, 0), (1, -1), 0.4, BORDER_GREY),
        ("LINEBEFORE",  (2, 0), (2, -1), 0.4, BORDER_GREY),
    ]))
    story.append(Spacer(1, 10))
    story.append(banner)

    # ── EXECUTIVE SUMMARY ─────────────────────────────────────────────────
    story.append(Paragraph("Executive Summary", s["section"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GREY, spaceAfter=8))

    # Strip basic markdown from explanation text
    clean_lines = []
    for line in (explanation_text or "").split("\n"):
        line = line.strip()
        if not line:
            continue
        line = line.lstrip("#").strip()       # strip markdown headings
        line = line.replace("**", "")         # strip bold markers
        clean_lines.append(line)

    for line in clean_lines:
        story.append(Paragraph(line, s["body"]))

    # ── ATTACK PATH ───────────────────────────────────────────────────────
    story.append(Paragraph("Attack Path Identified", s["section"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GREY, spaceAfter=8))

    hops = attack_path_result.get("hops", [])
    path_data = [[
        Paragraph("Step", s["th"]),
        Paragraph("Node Name", s["th"]),
        Paragraph("Node Type", s["th"]),
        Paragraph("Role", s["th"]),
    ]]
    for i, hop in enumerate(hops):
        role = "Entry Point" if i == 0 else ("Target (Crown Jewel)" if hop.get("is_crown_jewel") else "Intermediate Hop")
        path_data.append([
            Paragraph(str(i + 1), s["td"]),
            Paragraph(hop.get("name", hop.get("id", "Unknown")), s["td"]),
            Paragraph(hop.get("type", "—"), s["td"]),
            Paragraph(role, s["td"]),
        ])

    avail_w = PAGE_W - 2 * MARGIN
    path_table = Table(path_data, colWidths=[avail_w * 0.08, avail_w * 0.35, avail_w * 0.27, avail_w * 0.30])
    ts = _table_style()
    for row in range(1, len(path_data)):
        if row % 2 == 0:
            ts.append(("BACKGROUND", (0, row), (-1, row), ROW_ALT))
    path_table.setStyle(TableStyle(ts))
    story.append(path_table)

    # ── RECOMMENDED REMEDIATION ───────────────────────────────────────────
    story.append(Paragraph("Recommended Remediation", s["section"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GREY, spaceAfter=8))

    fix_data = [[
        Paragraph("#", s["th"]),
        Paragraph("Node / Action", s["th"]),
        Paragraph("Risk Reduced (Cumulative)", s["th"]),
        Paragraph("Reasoning", s["th"]),
    ]]
    for i, fix in enumerate(fixes):
        reasoning = (
            fix.get("technique_risk_source")
            or fix.get("reasoning_tag")
            or "—"
        )
        # For crown jewel targets, soften the action language
        action = fix.get("node_name", fix.get("node_id", "Unknown"))
        if fix.get("is_crown_jewel") or fix.get("node_type") in ("database", "credential-store"):
            action = f"Harden: {action}"
        else:
            action = f"Patch: {action}"
        fix_data.append([
            Paragraph(str(i + 1), s["td"]),
            Paragraph(action, s["td"]),
            Paragraph(f"−{fix.get('risk_cut_percent', 0)}%", s["td"]),
            Paragraph(reasoning, s["td"]),
        ])

    fix_table = Table(fix_data, colWidths=[avail_w * 0.06, avail_w * 0.38, avail_w * 0.22, avail_w * 0.34])
    ts2 = _table_style(header_color=colors.HexColor("#0D3349"))
    for row in range(1, len(fix_data)):
        if row % 2 == 0:
            ts2.append(("BACKGROUND", (0, row), (-1, row), ROW_ALT))
    fix_table.setStyle(TableStyle(ts2))
    story.append(fix_table)

    # ── FOOTER ────────────────────────────────────────────────────────────
    story.append(Spacer(1, 30))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GREY, spaceAfter=6))
    story.append(Paragraph(
        f"Generated by AEGIS-TWIN — Autonomous Digital Twin for Adversarial Path Simulation &nbsp;&nbsp;|&nbsp;&nbsp; {ts_display}",
        s["footer"]
    ))

    doc.build(story)
    return buf.getvalue()
