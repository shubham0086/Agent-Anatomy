#!/usr/bin/env python3
"""
Animated SVG for agent-anatomy: four organs wiring into one agent core.

Brain -> Memory -> Hands -> Loop light up in sequence, each drawing a
connection into the central core, which then pulses to "Full Agent".
SMIL animation (plays on GitHub README). Vector, ~kb.

Usage:  python scripts/make-anatomy-svg.py
Output: anatomy.svg in the repo root.
"""
from pathlib import Path
import math

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "anatomy.svg"

W, H = 900, 560
CX, CY = 450, 330
R = 175           # organ orbit radius
DUR = 10.0

# organ: (name, role, color, angle_deg)
ORGANS = [
    ("Brain", "the LLM — always on",        "#6366f1", -90),   # top
    ("Memory", "carries state across turns", "#a855f7", 180),   # left
    ("Hands", "tools — acts on the world",   "#38bdf8", 0),     # right
    ("Loop", "takes more than one step",     "#10b981", 90),    # bottom
]


def opacity_anim(t_on, begin_floor=0.18):
    kt = [0, max(t_on - 0.001, 0), t_on, t_on + 0.05, 0.92, 1.0]
    vals = [begin_floor, begin_floor, begin_floor, 1, 1, begin_floor]
    return (f'<animate attributeName="opacity" dur="{DUR}s" repeatCount="indefinite" '
            f'keyTimes="{";".join(f"{k:.4f}" for k in kt)}" '
            f'values="{";".join(str(v) for v in vals)}"/>')


def build():
    p = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
        f'viewBox="0 0 {W} {H}" font-family="Segoe UI, Helvetica, Arial, sans-serif">',
        f'<rect x="1" y="1" width="{W-2}" height="{H-2}" rx="16" fill="#0d1117" '
        f'stroke="#30363d" stroke-width="1.5"/>',
        f'<text x="40" y="54" font-size="30" font-weight="700" fill="#e6edf3">Agent Anatomy</text>',
        f'<text x="40" y="84" font-size="16" fill="#8b949e">one agent, four organs — take any one away and it collapses</text>',
    ]

    # connection lines (behind nodes), drawn in at each organ's t_on
    for i, (name, role, color, ang) in enumerate(ORGANS):
        t_on = 0.10 + i * 0.16
        ox = CX + R * math.cos(math.radians(ang))
        oy = CY + R * math.sin(math.radians(ang))
        # line from organ toward core (stops at core edge)
        dx, dy = CX - ox, CY - oy
        dist = math.hypot(dx, dy)
        ux, uy = dx / dist, dy / dist
        x2, y2 = CX - ux * 52, CY - uy * 52
        x1, y1 = ox + ux * 46, oy + uy * 46
        seg = math.hypot(x2 - x1, y2 - y1)
        p.append(
            f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" '
            f'stroke="{color}" stroke-width="2.2" stroke-opacity="0.55" '
            f'stroke-dasharray="{seg:.0f}">'
            f'<animate attributeName="stroke-dashoffset" dur="{DUR}s" repeatCount="indefinite" '
            f'keyTimes="0;{t_on:.3f};{t_on+0.06:.3f};1" '
            f'values="{seg:.0f};{seg:.0f};0;0"/></line>')
        # traveling signal dot organ -> core
        p.append(
            f'<circle r="4.5" fill="#ffffff" opacity="0.85">'
            f'<animateMotion dur="1.8s" repeatCount="indefinite" begin="{t_on*DUR:.2f}s" '
            f'path="M {x1:.0f} {y1:.0f} L {x2:.0f} {y2:.0f}"/>'
            f'<animate attributeName="opacity" dur="1.8s" repeatCount="indefinite" '
            f'begin="{t_on*DUR:.2f}s" values="0;0.9;0"/></circle>')

    # central core
    core_t = 0.10 + len(ORGANS) * 0.16
    p.append(f'<g opacity="0.18">{opacity_anim(core_t, 0.18)}'
             f'<circle cx="{CX}" cy="{CY}" r="50" fill="#10b981" fill-opacity="0.16" '
             f'stroke="#10b981" stroke-width="3"/>'
             f'<text x="{CX}" y="{CY-4}" font-size="18" font-weight="700" fill="#10b981" '
             f'text-anchor="middle">Full</text>'
             f'<text x="{CX}" y="{CY+18}" font-size="18" font-weight="700" fill="#10b981" '
             f'text-anchor="middle">Agent</text></g>')
    # expanding pulse ring when core activates
    p.append(f'<circle cx="{CX}" cy="{CY}" r="50" fill="none" stroke="#10b981" stroke-width="2">'
             f'<animate attributeName="r" dur="{DUR}s" repeatCount="indefinite" '
             f'keyTimes="0;{core_t:.3f};{core_t+0.12:.3f};1" values="50;50;92;92"/>'
             f'<animate attributeName="opacity" dur="{DUR}s" repeatCount="indefinite" '
             f'keyTimes="0;{core_t:.3f};{core_t+0.12:.3f};1" values="0;0.7;0;0"/></circle>')

    # organ nodes
    for i, (name, role, color, ang) in enumerate(ORGANS):
        t_on = 0.10 + i * 0.16
        ox = CX + R * math.cos(math.radians(ang))
        oy = CY + R * math.sin(math.radians(ang))
        g = [f'<g opacity="0.18">{opacity_anim(t_on)}']
        g.append(f'<circle cx="{ox:.0f}" cy="{oy:.0f}" r="46" fill="{color}" '
                 f'fill-opacity="0.16" stroke="{color}" stroke-width="2.4"/>')
        g.append(f'<text x="{ox:.0f}" y="{oy+5:.0f}" font-size="17" font-weight="700" '
                 f'fill="#e6edf3" text-anchor="middle">{name}</text>')
        # role label — offset to a side so it never crosses the spoke line
        if ang == 0:        # right organ
            lx, ly, anchor = W - 30, oy, "end"
        elif ang == 180:    # left organ
            lx, ly, anchor = 30, oy, "start"
        else:               # top / bottom organ -> place to the right of circle
            lx, ly, anchor = ox + 58, oy, "start"
        g.append(f'<text x="{lx:.0f}" y="{ly+4:.0f}" font-size="13" fill="#8b949e" '
                 f'text-anchor="{anchor}">{role}</text>')
        g.append('</g>')
        p.append("".join(g))

    p.append('</svg>')
    OUT.write_text("\n".join(p), encoding="utf-8")
    print(f"wrote {OUT}  ({OUT.stat().st_size/1024:.1f} KB)")


if __name__ == "__main__":
    build()
