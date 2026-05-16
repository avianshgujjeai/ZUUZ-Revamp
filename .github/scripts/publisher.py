import os, re, json, datetime, requests

TOKEN = os.environ["NOTION_TOKEN"]
DB_ID = os.environ.get("NOTION_DATABASE_ID", "ee23deae-c452-4c80-adce-06822eefb5db")
H = {"Authorization": "Bearer " + TOKEN, "Content-Type": "application/json", "Notion-Version": "2022-06-28"}

def slug(t):
    t = t.lower().strip()
    t = re.sub(r"[^\w\s-]", "", t)
    return re.sub(r"[\s_-]+", "-", t)[:80]

def fmt(t):
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"\*(.+?)\*", r"<em>\1</em>", t)
    return re.sub(r"\[(.+?)\]\((https?://[^\)]+)\)", r'<a href="\2">\1</a>', t)

def to_html(text):
    out, ul = [], False
    for line in text.splitlines():
        if line.startswith("## "):
            if ul: out.append("</ul>"); ul = False
            out.append("<h2>" + fmt(line[3:]) + "</h2>")
        elif line.startswith("# "):
            if ul: out.append("</ul>"); ul = False
            out.append("<h1>" + fmt(line[2:]) + "</h1>")
        elif line.startswith(("- ", "* ")):
            if not ul: out.append("<ul>"); ul = True
            out.append("<li>" + fmt(line[2:]) + "</li>")
        elif not line.strip():
            if ul: out.append("</ul>"); ul = False
        else:
            if ul: out.append("</ul>"); ul = False
            t = fmt(line)
            if t.strip(): out.append("<p>" + t + "</p>")
    if ul: out.append("</ul>")
    return "\n".join(out)

def build(title, s, body, date):
    return open("blog.html").read() if False else (
        "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'>"
        "<meta name='viewport' content='width=device-width,initial-scale=1'>"
        "<title>" + title + " | ZUUZ</title>"
        "<meta name='description' content='ZUUZ: " + title + "'>"
        "<link rel='canonical' href='https://www.zuuz.ai/blog-" + s + ".html'>"
        "<link rel='icon' href='/assets/favicon-32.png'>"
        "<link rel='preconnect' href='https://fonts.googleapis.com'>"
        "<link href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap' rel='stylesheet'>"
        "<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Montserrat',sans-serif;color:#0A0E27;background:#fff}"
        "a{color:inherit;text-decoration:none}img{max-width:100%;display:block}"
        ".nav{position:sticky;top:0;z-index:900;background:#fff;border-bottom:1px solid #E0E2EF;height:64px;display:flex;align-items:center;padding:0 5vw}"
        ".nav-inner{width:100%;max-width:1240px;margin:0 auto;display:flex;align-items:center;gap:24px}"
        ".btn{font-size:13px;font-weight:700;padding:9px 20px;border-radius:4px;background:#2563eb;color:#fff;border:none}"
        ".wrap{max-width:760px;margin:0 auto;padding:64px 24px 96px}"
        ".eye{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#2563eb;margin-bottom:16px}"
        ".wrap h1{font-size:clamp(28px,4vw,44px);font-weight:900;line-height:1.12;margin-bottom:24px}"
        ".wrap h2{font-size:clamp(20px,2.5vw,26px);font-weight:800;margin:48px 0 16px}"
        ".wrap p{font-size:16px;line-height:1.8;color:#5B6080;margin-bottom:20px}"
        ".wrap ul{margin:16px 0 24px 24px}.wrap li{font-size:16px;line-height:1.75;color:#5B6080;margin-bottom:10px}"
        ".wrap strong{color:#0A0E27}.meta{font-size:13px;color:#5B6080;margin-bottom:40px}"
        ".cta{background:#2563eb;border-radius:16px;padding:40px;margin:56px 0 0;text-align:center}"
        ".cta h3{color:#fff;margin-bottom:12px;font-size:22px}.cta p{color:rgba(255,255,255,.82);margin-bottom:24px}"
        ".cta a{display:inline-block;background:#fff;color:#2563eb;font-weight:700;padding:12px 28px;border-radius:4px}"
        "footer{background:#0A0E27;padding:48px 5vw;color:rgba(255,255,255,.6);text-align:center;font-size:13px}"
        "footer a{color:rgba(255,255,255,.65)}@media(max-width:768px){.wrap{padding:40px 20px 64px}}</style></head>"
        "<body><nav class='nav'><div class='nav-inner'>"
        "<a href='index.html'><img src='/assets/zuuz-logo.png' alt='ZUUZ' style='height:32px'></a>"
        "<a href='blog.html' style='font-size:13px;font-weight:600;margin-left:auto;margin-right:24px'>Blog</a>"
        "<a href='book-a-demo.html' class='btn'>Book a Demo</a></div></nav>"
        "<div class='wrap'><div class='eye'>ZUUZ &middot; Revenue Intelligence</div>"
        "<h1>" + title + "</h1>"
        "<div class='meta'>By Avinash Gujje, ZUUZ &nbsp;&middot;&nbsp; " + date + "</div>"
        + to_html(body) +
        "<div class='cta'><h3>See ZUUZ in action.</h3>"
        "<p>Stop letting pipeline risk hide in email.</p>"
        "<a href='https://zuuz.ai/demo'>Book a Demo &rarr;</a></div></div>"
        "<footer><a href='index.html'>ZUUZ</a> &middot; <a href='blog.html'>Blog</a>"
        " &middot; <a href='book-a-demo.html'>Book a Demo</a><br><br>&copy; 2026 ZUUZ, Inc.</footer>"
        "<script defer src='https://cdn.vercel-insights.com/v1/script.js'></script></body></html>"
    )

print("ZUUZ Blog Publisher starting...")
r = requests.post("https://api.notion.com/v1/databases/" + DB_ID + "/query", headers=H,
    json={"filter": {"and": [{"property": "Type", "select": {"equals": "Blog Post"}},
                              {"property": "Stage", "select": {"equals": "Draft"}}]}})
r.raise_for_status()
pages = r.json().get("results", [])
print("Found " + str(len(pages)) + " draft(s).")

for page in pages:
    p = page["properties"]
    title = "".join(t.get("plain_text","") for t in p.get("Title",{}).get("title",[])).strip()
    draft = "".join(t.get("plain_text","") for t in p.get("Draft",{}).get("rich_text",[])).strip()
    if not title or len(draft) < 100:
        print("  Skip: " + repr(title)); continue
    s = slug(title)
    fname = "blog-" + s + ".html"
    if os.path.exists(fname):
        print("  Exists: " + fname); continue
    date = datetime.date.today().isoformat()
    with open(fname, "w", encoding="utf-8") as f:
        f.write(build(title, s, draft, date))
    print("  Published: " + fname)
    try:
        idx = open("blog.html", encoding="utf-8").read()
        card = ('<div class="card" style="margin-bottom:16px;padding:24px"><div style="display:flex;gap:24px;align-items:flex-start"><div style="flex:1">'
                '<h3 style="font-size:17px;margin-bottom:8px">' + title + '</h3>'
                '<a href="blog-' + s + '.html" style="display:inline-block;margin-top:12px;font-size:12px;font-weight:700;color:var(--blue)">Read &rarr;</a>'
                '</div></div></div>\n')
        marker = '<div class="card" style="margin-bottom:16px;padding:24px">'
        if marker in idx:
            open("blog.html","w",encoding="utf-8").write(idx.replace(marker, card+marker, 1))
            print("  blog.html updated.")
    except Exception as e:
        print("  blog.html skip: " + str(e))
    requests.patch("https://api.notion.com/v1/pages/" + page["id"], headers=H,
        json={"properties": {"Stage": {"select": {"name": "Published"}},
                              "Buffer Link": {"url": "https://www.zuuz.ai/blog-" + s + ".html"}}})
    print("  Notion marked Published.")

print("Done.")
