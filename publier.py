#!/usr/bin/env python3
"""Publie la démo Hilloulot sur GitHub Pages (https://codenolimits.github.io/hilloulot/).

Usage : python3 publier.py <dossier_du_site_construit> [base]
Copie le site à la racine de ce dépôt et préfixe les chemins absolus par `base`
(défaut /hilloulot). Quand un domaine sera acheté : base vide "" + fichier CNAME.
Ensuite : git add -A && git commit -m "..." && git push.
"""
import os, re, shutil, sys

src = os.path.abspath(sys.argv[1]); base = sys.argv[2] if len(sys.argv) > 2 else "/hilloulot"
here = os.path.dirname(os.path.abspath(__file__))
KEEP = {".git", "publier.py", "README.md", ".nojekyll", "CNAME"}
TOP = "fr/|he/|en/|img/|audio/|videos/|app\\.js|style\\.css|favicon\\.svg|days\\.json"
pat = re.compile(r'(["\'=(])/(' + TOP + ')')

for name in os.listdir(here):
    if name not in KEEP:
        p = os.path.join(here, name); shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
n = 0
for dp, _, files in os.walk(src):
    for f in files:
        if f == "vercel.json": continue  # ignoré par GitHub Pages
        rel = os.path.relpath(os.path.join(dp, f), src); out = os.path.join(here, rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        if f.endswith((".html", ".js", ".json", ".css")):
            s = open(os.path.join(dp, f), encoding="utf-8").read()
            s = pat.sub(lambda m: m.group(1) + base + "/" + m.group(2), s)
            s = s.replace("fetch('/'+lang", "fetch('" + base + "/'+lang")
            open(out, "w", encoding="utf-8").write(s)
        else:
            shutil.copy2(os.path.join(dp, f), out)
        n += 1
print(f"{n} fichiers publiés depuis {src} (base {base or '/'})")
