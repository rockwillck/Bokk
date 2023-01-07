class Page:
    def __init__(self, title, subtitle=None):
        self.title = title
        self.subtitle = subtitle

class Document:
    def __init__(self):
        self.pages = []

    def add_page(self, page: Page):
        self.pages.add(page)