import os
import re

ROOT = r"C:\Users\harsh\OneDrive\Desktop\HarshGuruJi"

# 1. Update store.js in store and site
def update_store_js():
    paths = [
        os.path.join(ROOT, "store", "js", "store.js"),
        os.path.join(ROOT, "site", "js", "store.js")
    ]
    for p in paths:
        if not os.path.exists(p):
            continue
        with open(p, "r", encoding="utf-8") as f:
            code = f.read()

        old_func = """function showLoading() {
  if (elements.sectionsView) {
    elements.sectionsView.innerHTML = '<div class="store-message">Loading verified store releases...</div>';
  }
}"""
        new_func = """function showLoading() {
  if (elements.sectionsView) {
    if (typeof window.renderHarshLoader === 'function') {
      elements.sectionsView.innerHTML = '<div style="padding: 3.5rem 1rem; text-align: center;">' +
        window.renderHarshLoader('Loading GuruStore...', 'Fetching verified app releases & security signatures...', 'compact') +
        '</div>';
    } else {
      elements.sectionsView.innerHTML = '<div class="store-message">Loading verified store releases...</div>';
    }
  }
}"""
        if old_func in code:
            code = code.replace(old_func, new_func)
            with open(p, "w", encoding="utf-8") as f:
                f.write(code)
            print(f"Updated showLoading in {p}")
        elif "renderHarshLoader" not in code:
            # Fallback regex match for showLoading
            pattern = re.compile(r"function\s+showLoading\s*\(\)\s*\{[^}]*elements\.sectionsView\.innerHTML\s*=[^}]*\}", re.MULTILINE)
            if pattern.search(code):
                code = pattern.sub(new_func, code)
                with open(p, "w", encoding="utf-8") as f:
                    f.write(code)
                print(f"Regex-updated showLoading in {p}")

# 2. Update books-engine.js in books and site
def update_books_engine_js():
    paths = [
        os.path.join(ROOT, "books", "js", "books-engine.js"),
        os.path.join(ROOT, "site", "js", "books-engine.js")
    ]
    for p in paths:
        if not os.path.exists(p):
            continue
        with open(p, "r", encoding="utf-8") as f:
            code = f.read()

        target = """    if (allBooks.length === 0) {
      booksGrid.innerHTML = `
        <div class="empty-books-state">
          <div class="icon">📚</div>
          <h4>Loading Official NCERT Books Library...</h4>
          <p>Connecting to master textbook repository for Classes 1 to 12.</p>
        </div>
      `;
      return;
    }"""
        replacement = """    if (allBooks.length === 0) {
      if (typeof window.renderHarshLoader === 'function') {
        booksGrid.innerHTML = '<div style="padding: 3.5rem 1rem; grid-column: 1 / -1; text-align: center;">' +
          window.renderHarshLoader('Loading NCERT Books...', 'Connecting to master textbook repository for Classes 1 to 12...', 'compact') +
          '</div>';
      } else {
        booksGrid.innerHTML = `
          <div class="empty-books-state">
            <div class="icon">📚</div>
            <h4>Loading Official NCERT Books Library...</h4>
            <p>Connecting to master textbook repository for Classes 1 to 12.</p>
          </div>
        `;
      }
      return;
    }"""
        if target in code:
            code = code.replace(target, replacement)
            with open(p, "w", encoding="utf-8") as f:
                f.write(code)
            print(f"Updated booksGrid loading in {p}")

if __name__ == "__main__":
    update_store_js()
    update_books_engine_js()
