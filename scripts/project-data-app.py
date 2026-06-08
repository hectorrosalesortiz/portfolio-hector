from __future__ import annotations

import json
import re
import shutil
import sys
from pathlib import Path
from tkinter import BooleanVar, StringVar, Tk, filedialog, messagebox
from tkinter import ttk
import tkinter as tk


ROOT_DIR = Path(__file__).resolve().parents[1]
PROJECTS_DIR = ROOT_DIR / "data" / "portfolio" / "projects"
SKILLS_DIR = ROOT_DIR / "data" / "portfolio" / "skills"
PROJECT_ASSETS_DIR = ROOT_DIR / "public" / "assets" / "projects"
LINK_TYPES = {"web", "ios", "android", "company", "reference"}
MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower())
    slug = slug.strip("-")
    return slug[:80]


def parse_list(value: str) -> list[str]:
    return [item.strip() for item in re.split(r"\r?\n|,", value or "") if item.strip()]


def format_list(value: object) -> str:
    if not isinstance(value, list):
        return ""
    return "\n".join(str(item) for item in value)


def parse_links(value: str) -> list[dict[str, str]]:
    links: list[dict[str, str]] = []

    for raw_line in (value or "").splitlines():
        line = raw_line.strip()
        if not line:
            continue

        parts = [part.strip() for part in line.split("|")]

        if len(parts) < 2:
            raise ValueError(f'Invalid link "{line}". Use: Label | URL | type')

        label, href = parts[0], parts[1]
        link_type = parts[2] if len(parts) > 2 and parts[2] else "web"

        if not label or not href:
            raise ValueError(f'Invalid link "{line}". Label and URL are required.')

        if link_type not in LINK_TYPES:
            valid_types = ", ".join(sorted(LINK_TYPES))
            raise ValueError(f'Invalid link type "{link_type}". Use one of: {valid_types}.')

        links.append({"label": label, "href": href, "type": link_type})

    return links


def format_links(value: object) -> str:
    if not isinstance(value, list):
        return ""

    lines: list[str] = []

    for item in value:
        if not isinstance(item, dict):
            continue
        label = item.get("label", "")
        href = item.get("href", "")
        link_type = item.get("type", "web")
        lines.append(f"{label} | {href} | {link_type}")

    return "\n".join(lines)


def clean_project(project: dict[str, object]) -> dict[str, object]:
    cleaned: dict[str, object] = {}

    for key, value in project.items():
        if isinstance(value, str) and value.strip():
            cleaned[key] = value.strip()
        elif isinstance(value, list) and value:
            cleaned[key] = value
        elif isinstance(value, bool) and value:
            cleaned[key] = value

    return cleaned


def project_files() -> list[Path]:
    PROJECTS_DIR.mkdir(parents=True, exist_ok=True)
    return sorted(PROJECTS_DIR.glob("*.json"), key=lambda item: item.name)


def next_index() -> str:
    indexes: list[int] = []

    for file_path in project_files():
        match = re.match(r"^(\d+)-", file_path.name)
        if match:
            indexes.append(int(match.group(1)))

    return f"{max(indexes, default=0) + 1:02d}"


def unique_filename(base_name: str) -> str:
    existing = {file_path.name for file_path in project_files()}

    if base_name not in existing:
        return base_name

    path = Path(base_name)
    for suffix in range(2, 100):
        candidate = f"{path.stem}-{suffix}{path.suffix}"
        if candidate not in existing:
            return candidate

    raise ValueError("Could not create a unique filename.")


def unique_asset_path(file_path: Path) -> Path:
    PROJECT_ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    slug = slugify(file_path.stem) or "project-thumbnail"
    extension = file_path.suffix.lower() or ".png"
    candidate = PROJECT_ASSETS_DIR / f"{slug}{extension}"

    for suffix in range(2, 100):
        if not candidate.exists():
            return candidate
        candidate = PROJECT_ASSETS_DIR / f"{slug}-{suffix}{extension}"

    raise ValueError("Could not create a unique thumbnail filename.")


def load_site_skills() -> list[str]:
    skills: set[str] = set()

    for file_path in sorted(SKILLS_DIR.glob("*.json"), key=lambda item: item.name):
        try:
            data = json.loads(file_path.read_text(encoding="utf-8"))
        except Exception:
            continue

        for skill in data.get("skills", []):
            if isinstance(skill, str) and skill.strip():
                skills.add(skill.strip())

    return sorted(skills, key=str.lower)


def split_period(value: str) -> tuple[str, str, bool]:
    if " - " not in value:
        return "", "", True

    start, end = [part.strip() for part in value.split(" - ", 1)]
    return start, "" if end.lower() == "present" else end, end.lower() == "present"


def build_period(start: str, end: str, present: bool) -> str:
    start = start.strip()
    end = "Present" if present else end.strip()

    if start and end:
        return f"{start} - {end}"

    return start or end


class MonthYearPicker(tk.Toplevel):
    def __init__(self, parent: tk.Misc, title: str, target_var: StringVar):
        super().__init__(parent)
        self.title(title)
        self.resizable(False, False)
        self.configure(bg="#0f172a")
        self.target_var = target_var
        current = target_var.get().split()
        month = current[0] if current and current[0] in MONTHS else MONTHS[0]
        year = current[1] if len(current) > 1 and current[1].isdigit() else "2026"
        self.month_var = StringVar(value=month)
        self.year_var = StringVar(value=year)

        frame = ttk.Frame(self, style="Panel.TFrame", padding=18)
        frame.pack(fill=tk.BOTH, expand=True)
        ttk.Label(frame, text=title, style="Label.TLabel").grid(row=0, column=0, columnspan=2, sticky=tk.W, pady=(0, 10))
        ttk.Combobox(frame, values=MONTHS, textvariable=self.month_var, state="readonly", width=16, style="Modern.TCombobox").grid(row=1, column=0, padx=(0, 8))
        ttk.Spinbox(frame, from_=1990, to=2050, textvariable=self.year_var, width=8, style="Modern.TSpinbox").grid(row=1, column=1)
        ttk.Button(frame, text="Cancel", style="Ghost.TButton", command=self.destroy).grid(row=2, column=0, sticky=tk.EW, pady=(14, 0), padx=(0, 8))
        ttk.Button(frame, text="Use Date", style="Accent.TButton", command=self.apply).grid(row=2, column=1, sticky=tk.EW, pady=(14, 0))
        self.transient(parent)
        self.grab_set()

    def apply(self) -> None:
        self.target_var.set(f"{self.month_var.get()} {self.year_var.get()}")
        self.destroy()


class ListEditor(ttk.Frame):
    def __init__(
        self,
        parent: tk.Misc,
        label: str,
        options: list[str] | None = None,
        upload_images: bool = False,
        hint: str = "",
    ):
        super().__init__(parent, style="Card.TFrame", padding=12)
        self.options = options or []
        self.upload_images = upload_images
        self.value_var = StringVar()
        self.items: list[str] = []

        ttk.Label(self, text=label, style="CardLabel.TLabel").pack(anchor=tk.W, pady=(0, 7))
        body = ttk.Frame(self, style="Card.TFrame")
        body.pack(fill=tk.X)

        self.listbox = tk.Listbox(
            body,
            height=5,
            background="#0b1120",
            foreground="#f8fafc",
            selectbackground="#92400e",
            relief=tk.FLAT,
            activestyle="none",
            font=("Segoe UI", 10),
            highlightthickness=1,
            highlightbackground="#263244",
            highlightcolor="#facc15",
            bd=0,
        )
        self.listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.listbox.bind("<<ListboxSelect>>", self.on_select)

        controls = ttk.Frame(body, style="Card.TFrame", padding=(10, 0, 0, 0))
        controls.pack(side=tk.RIGHT, fill=tk.Y)

        if self.options:
            self.input_widget = ttk.Combobox(controls, textvariable=self.value_var, values=self.options, style="Modern.TCombobox")
        else:
            self.input_widget = ttk.Entry(controls, textvariable=self.value_var, style="Modern.TEntry")

        self.input_widget.pack(fill=tk.X, pady=(0, 8))
        ttk.Button(controls, text="Add", style="Accent.TButton", command=self.add_item).pack(fill=tk.X, pady=(0, 6))
        ttk.Button(controls, text="Update", style="Ghost.TButton", command=self.update_item).pack(fill=tk.X, pady=(0, 6))
        ttk.Button(controls, text="Delete", style="Danger.TButton", command=self.delete_item).pack(fill=tk.X, pady=(0, 6))

        if upload_images:
            ttk.Button(controls, text="Upload Thumbnail", style="Ghost.TButton", command=self.upload_image).pack(fill=tk.X)

        if hint:
            ttk.Label(self, text=hint, style="CardHint.TLabel").pack(anchor=tk.W, pady=(7, 0))

    def on_select(self, _event: object | None = None) -> None:
        selected = self.listbox.curselection()
        if selected:
            self.value_var.set(self.items[selected[0]])

    def refresh(self) -> None:
        self.listbox.delete(0, tk.END)
        for item in self.items:
            self.listbox.insert(tk.END, item)

    def add_item(self) -> None:
        value = self.value_var.get().strip()
        if value and value not in self.items:
            self.items.append(value)
            self.value_var.set("")
            self.refresh()

    def update_item(self) -> None:
        selected = self.listbox.curselection()
        value = self.value_var.get().strip()
        if selected and value:
            self.items[selected[0]] = value
            self.refresh()

    def delete_item(self) -> None:
        selected = self.listbox.curselection()
        if selected:
            del self.items[selected[0]]
            self.value_var.set("")
            self.refresh()

    def upload_image(self) -> None:
        file_paths = filedialog.askopenfilenames(
            title="Upload project thumbnails",
            filetypes=[
                ("Images", "*.png *.jpg *.jpeg *.webp *.gif"),
                ("All files", "*.*"),
            ],
        )

        for raw_path in file_paths:
            source = Path(raw_path)
            target = unique_asset_path(source)
            shutil.copy2(source, target)
            public_path = "/" + target.relative_to(ROOT_DIR / "public").as_posix()
            if public_path not in self.items:
                self.items.append(public_path)

        self.refresh()

    def set_items(self, values: object) -> None:
        self.items = [str(item) for item in values] if isinstance(values, list) else []
        self.value_var.set("")
        self.refresh()

    def get_items(self) -> list[str]:
        return [item for item in self.items if item.strip()]


class Field:
    def __init__(self, key: str, label: str, multiline: bool = False, required: bool = False, hint: str = ""):
        self.key = key
        self.label = label
        self.multiline = multiline
        self.required = required
        self.hint = hint


FIELDS = [
    Field("title", "Project Title", required=True),
    Field("company", "Company"),
    Field("role", "Role"),
    Field("location", "Location"),
    Field("webUrl", "Web URL"),
    Field("description", "Description", multiline=True, required=True),
    Field("impact", "Impact", multiline=True, required=True),
    Field("links", "Links", multiline=True, hint="One per line: Label | URL | web/ios/android/company/reference"),
    Field("demoUrl", "Demo URL"),
    Field("githubUrl", "GitHub URL"),
    Field("slug", "Custom Slug", hint="Used only when creating a new JSON file."),
]


class ProjectDataApp:
    def __init__(self, root: Tk):
        self.root = root
        self.root.title("Portfolio Data Studio")
        self.root.geometry("1280x820")
        self.root.minsize(1040, 700)
        self.root.configure(bg="#070b14")

        self.current_file: Path | None = None
        self.project_items: list[tuple[Path, dict[str, object]]] = []
        self.skill_options = load_site_skills()
        self.entry_vars: dict[str, StringVar] = {}
        self.text_widgets: dict[str, tk.Text] = {}
        self.list_editors: dict[str, ListEditor] = {}
        self.start_period_var = StringVar()
        self.end_period_var = StringVar()
        self.present_var = BooleanVar(value=True)
        self.featured_var = BooleanVar(value=True)
        self.status_var = StringVar(value="Ready")

        self.configure_style()
        self.build_layout()
        self.load_projects()
        self.new_project()

    def configure_style(self) -> None:
        style = ttk.Style()
        style.theme_use("clam")
        bg = "#070b14"
        panel = "#0f172a"
        card = "#111827"
        card_alt = "#172033"
        line = "#263244"
        text = "#f8fafc"
        muted = "#94a3b8"
        amber = "#facc15"
        amber_dark = "#92400e"

        self.root.option_add("*TCombobox*Listbox.background", card)
        self.root.option_add("*TCombobox*Listbox.foreground", text)
        self.root.option_add("*TCombobox*Listbox.selectBackground", amber_dark)
        self.root.option_add("*TCombobox*Listbox.selectForeground", text)

        style.configure(".", background=bg, foreground=text, fieldbackground=card)
        style.configure("App.TFrame", background=bg)
        style.configure("Panel.TFrame", background=panel)
        style.configure("Card.TFrame", background=card)
        style.configure("Toolbar.TFrame", background=bg)
        style.configure("Title.TLabel", background=bg, foreground=text, font=("Segoe UI", 26, "bold"))
        style.configure("Subtitle.TLabel", background=bg, foreground=muted, font=("Segoe UI", 10))
        style.configure("Eyebrow.TLabel", background=bg, foreground=amber, font=("Segoe UI", 9, "bold"))
        style.configure("Label.TLabel", background=panel, foreground="#dbeafe", font=("Segoe UI", 9, "bold"))
        style.configure("CardLabel.TLabel", background=card, foreground="#dbeafe", font=("Segoe UI", 9, "bold"))
        style.configure("Hint.TLabel", background=panel, foreground=muted, font=("Segoe UI", 8))
        style.configure("CardHint.TLabel", background=card, foreground=muted, font=("Segoe UI", 8))
        style.configure("Status.TLabel", background=bg, foreground=muted, font=("Segoe UI", 9))

        style.configure("TButton", background=card_alt, foreground=text, bordercolor=line, focusthickness=0, padding=(14, 9), font=("Segoe UI", 9, "bold"))
        style.map("TButton", background=[("active", "#1f2937")], foreground=[("disabled", "#64748b")])
        style.configure("Accent.TButton", background=amber, foreground="#111827", bordercolor=amber, focusthickness=0)
        style.map("Accent.TButton", background=[("active", "#f59e0b")])
        style.configure("Danger.TButton", background="#dc2626", foreground="#ffffff", bordercolor="#dc2626", focusthickness=0)
        style.map("Danger.TButton", background=[("active", "#b91c1c")])
        style.configure("Ghost.TButton", background=card, foreground=muted, bordercolor=line, focusthickness=0)
        style.map("Ghost.TButton", background=[("active", "#1f2937")], foreground=[("active", text)])

        style.configure("Modern.TEntry", fieldbackground=card, foreground=text, insertcolor=amber, bordercolor=line, lightcolor=line, darkcolor=line, padding=(12, 10))
        style.map("Modern.TEntry", bordercolor=[("focus", amber)], lightcolor=[("focus", amber)], darkcolor=[("focus", amber)])
        style.configure("Modern.TCombobox", fieldbackground=card, background=card, foreground=text, arrowcolor=amber, bordercolor=line, lightcolor=line, darkcolor=line, padding=(10, 8))
        style.map("Modern.TCombobox", fieldbackground=[("readonly", card)], bordercolor=[("focus", amber)], lightcolor=[("focus", amber)], darkcolor=[("focus", amber)])
        style.configure("Modern.TSpinbox", fieldbackground=card, background=card, foreground=text, arrowcolor=amber, bordercolor=line, lightcolor=line, darkcolor=line, padding=(10, 8))
        style.configure("TCheckbutton", background=panel, foreground=text, font=("Segoe UI", 9, "bold"))
        style.map("TCheckbutton", background=[("active", panel)], foreground=[("active", text)])

        style.configure("Studio.TNotebook", background=bg, borderwidth=0, tabmargins=(0, 0, 0, 12))
        style.configure("Studio.TNotebook.Tab", background=card, foreground=muted, padding=(18, 11), font=("Segoe UI", 10, "bold"))
        style.map(
            "Studio.TNotebook.Tab",
            background=[("selected", "#facc15"), ("active", "#1f2937")],
            foreground=[("selected", "#111827"), ("active", text)],
        )

        style.configure("Treeview", background=card, foreground=text, fieldbackground=card, bordercolor=line, rowheight=38, font=("Segoe UI", 10))
        style.configure("Treeview.Heading", background="#1e293b", foreground=text, font=("Segoe UI", 9, "bold"))
        style.map("Treeview", background=[("selected", amber_dark)], foreground=[("selected", text)])

    def build_layout(self) -> None:
        shell = ttk.Frame(self.root, style="App.TFrame", padding=18)
        shell.pack(fill=tk.BOTH, expand=True)

        header = ttk.Frame(shell, style="App.TFrame")
        header.pack(fill=tk.X, pady=(0, 16))

        title_area = ttk.Frame(header, style="App.TFrame")
        title_area.pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Label(title_area, text="Portfolio Data Studio", style="Title.TLabel").pack(anchor=tk.W)
        ttk.Label(
            title_area,
            text="Manage portfolio JSON data. Projects are fully editable now; the same studio layout is ready for profile, skills, timeline, and contact data.",
            style="Subtitle.TLabel",
        ).pack(anchor=tk.W, pady=(4, 0))

        actions = ttk.Frame(header, style="App.TFrame")
        actions.pack(side=tk.RIGHT)
        ttk.Button(actions, text="New Project", style="Ghost.TButton", command=self.new_project).pack(side=tk.LEFT, padx=(0, 8))
        ttk.Button(actions, text="Save", style="Accent.TButton", command=self.save_project).pack(side=tk.LEFT)

        notebook = ttk.Notebook(shell, style="Studio.TNotebook")
        notebook.pack(fill=tk.BOTH, expand=True)

        projects_tab = ttk.Frame(notebook, style="App.TFrame", padding=0)
        notebook.add(projects_tab, text="Projects")

        for tab_name, description in [
            ("Profile", "Edit name, title, contact identity, and address data."),
            ("Experience", "Manage professional timeline JSON files."),
            ("Skills", "Manage skill categories and shared stack options."),
            ("Contact", "Manage contact methods and social links."),
            ("Education", "Manage university and education data."),
        ]:
            tab = ttk.Frame(notebook, style="Panel.TFrame", padding=28)
            ttk.Label(tab, text=tab_name, style="Label.TLabel").pack(anchor=tk.W)
            ttk.Label(
                tab,
                text=f"{description} This tab is prepared for the full portfolio manager flow.",
                style="Hint.TLabel",
            ).pack(anchor=tk.W, pady=(8, 0))
            notebook.add(tab, text=tab_name)

        body = ttk.PanedWindow(projects_tab, orient=tk.HORIZONTAL)
        body.pack(fill=tk.BOTH, expand=True)

        left = ttk.Frame(body, style="Panel.TFrame", padding=14)
        right = ttk.Frame(body, style="Panel.TFrame", padding=14)
        body.add(left, weight=1)
        body.add(right, weight=3)

        ttk.Label(left, text="Project Files", style="Label.TLabel").pack(anchor=tk.W)
        self.tree = ttk.Treeview(left, columns=("company", "file"), show="headings", selectmode="browse")
        self.tree.heading("company", text="Project")
        self.tree.heading("file", text="File")
        self.tree.column("company", width=240, anchor=tk.W)
        self.tree.column("file", width=220, anchor=tk.W)
        self.tree.pack(fill=tk.BOTH, expand=True, pady=(8, 10))
        self.tree.bind("<<TreeviewSelect>>", self.on_project_select)

        left_actions = ttk.Frame(left, style="Panel.TFrame")
        left_actions.pack(fill=tk.X)
        ttk.Button(left_actions, text="Refresh", style="Ghost.TButton", command=self.load_projects).pack(side=tk.LEFT, padx=(0, 8))
        ttk.Button(left_actions, text="Delete", style="Danger.TButton", command=self.delete_project).pack(side=tk.LEFT)

        canvas = tk.Canvas(right, background="#0f172a", highlightthickness=0)
        scrollbar = ttk.Scrollbar(right, orient=tk.VERTICAL, command=canvas.yview)
        form = ttk.Frame(canvas, style="Panel.TFrame", padding=(0, 0, 8, 0))

        form.bind("<Configure>", lambda event: canvas.configure(scrollregion=canvas.bbox("all")))
        canvas.create_window((0, 0), window=form, anchor=tk.NW)
        canvas.configure(yscrollcommand=scrollbar.set)
        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.filename_var = StringVar(value="New project")
        ttk.Label(form, text="Current File", style="Label.TLabel").grid(row=0, column=0, sticky=tk.W, pady=(0, 4))
        filename = ttk.Entry(form, textvariable=self.filename_var, state="readonly", style="Modern.TEntry")
        filename.grid(row=1, column=0, columnspan=2, sticky=tk.EW, pady=(0, 12))

        row = 2
        for index, field in enumerate(FIELDS):
            column = index % 2
            if field.multiline:
                column = 0
                if row % 2:
                    row += 1

            container = ttk.Frame(form, style="Card.TFrame", padding=12)
            container.grid(row=row, column=column, sticky=tk.NSEW, padx=(0, 10 if column == 0 else 0), pady=(0, 12), columnspan=2 if field.multiline else 1)

            label_text = f"{field.label}{' *' if field.required else ''}"
            ttk.Label(container, text=label_text, style="CardLabel.TLabel").pack(anchor=tk.W, pady=(0, 7))

            if field.multiline:
                text = tk.Text(
                    container,
                    height=4,
                    background="#0b1120",
                    foreground="#f8fafc",
                    insertbackground="#facc15",
                    relief=tk.FLAT,
                    wrap=tk.WORD,
                    padx=10,
                    pady=8,
                    font=("Segoe UI", 10),
                    highlightthickness=1,
                    highlightbackground="#263244",
                    highlightcolor="#facc15",
                    bd=0,
                )
                text.pack(fill=tk.X)
                self.text_widgets[field.key] = text
            else:
                var = StringVar()
                entry = ttk.Entry(container, textvariable=var, style="Modern.TEntry")
                entry.pack(fill=tk.X)
                self.entry_vars[field.key] = var

            if field.hint:
                ttk.Label(container, text=field.hint, style="CardHint.TLabel").pack(anchor=tk.W, pady=(6, 0))

            if field.multiline or column == 1:
                row += 1

        period_frame = ttk.Frame(form, style="Card.TFrame", padding=12)
        period_frame.grid(row=row, column=0, columnspan=2, sticky=tk.EW, pady=(0, 12))
        ttk.Label(period_frame, text="Period", style="CardLabel.TLabel").pack(anchor=tk.W, pady=(0, 7))
        period_inputs = ttk.Frame(period_frame, style="Card.TFrame")
        period_inputs.pack(fill=tk.X)
        ttk.Entry(period_inputs, textvariable=self.start_period_var, state="readonly", style="Modern.TEntry").pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Button(
            period_inputs,
            text="Pick Start",
            style="Ghost.TButton",
            command=lambda: MonthYearPicker(self.root, "Start date", self.start_period_var),
        ).pack(side=tk.LEFT, padx=(8, 14))
        self.end_period_entry = ttk.Entry(period_inputs, textvariable=self.end_period_var, state="readonly", style="Modern.TEntry")
        self.end_period_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
        self.end_period_button = ttk.Button(
            period_inputs,
            text="Pick End",
            style="Ghost.TButton",
            command=lambda: MonthYearPicker(self.root, "End date", self.end_period_var),
        )
        self.end_period_button.pack(side=tk.LEFT, padx=(8, 14))
        ttk.Checkbutton(period_inputs, text="Present", variable=self.present_var, command=self.sync_present_state).pack(side=tk.LEFT)
        row += 1

        self.list_editors["stack"] = ListEditor(
            form,
            "Stack *",
            options=self.skill_options,
            hint="Select skills from the site's skill data or type a custom technology.",
        )
        self.list_editors["stack"].grid(row=row, column=0, columnspan=2, sticky=tk.EW, pady=(0, 12))
        row += 1

        self.list_editors["imageUrls"] = ListEditor(
            form,
            "Project Thumbnails",
            upload_images=True,
            hint="Upload copies images to public/assets/projects and stores the public URL.",
        )
        self.list_editors["imageUrls"].grid(row=row, column=0, columnspan=2, sticky=tk.EW, pady=(0, 12))
        row += 1

        self.list_editors["responsibilities"] = ListEditor(form, "Contributions", hint="Add, edit, or delete one contribution at a time.")
        self.list_editors["responsibilities"].grid(row=row, column=0, sticky=tk.NSEW, padx=(0, 10), pady=(0, 12))
        self.list_editors["achievements"] = ListEditor(form, "Impact Points", hint="Add, edit, or delete one impact point at a time.")
        self.list_editors["achievements"].grid(row=row, column=1, sticky=tk.NSEW, pady=(0, 12))
        row += 1

        featured = ttk.Checkbutton(form, text="Featured project", variable=self.featured_var)
        featured.grid(row=row, column=0, sticky=tk.W, pady=(0, 16))

        form_actions = ttk.Frame(form, style="Panel.TFrame")
        form_actions.grid(row=row + 1, column=0, columnspan=2, sticky=tk.E, pady=(0, 12))
        ttk.Button(form_actions, text="Clear", style="Ghost.TButton", command=self.clear_form).pack(side=tk.LEFT, padx=(0, 8))
        ttk.Button(form_actions, text="Save Project", style="Accent.TButton", command=self.save_project).pack(side=tk.LEFT)

        form.columnconfigure(0, weight=1)
        form.columnconfigure(1, weight=1)

        ttk.Label(shell, textvariable=self.status_var, style="Status.TLabel").pack(anchor=tk.W, pady=(10, 0))

    def sync_present_state(self) -> None:
        state = "disabled" if self.present_var.get() else "readonly"
        self.end_period_entry.configure(state=state)
        self.end_period_button.configure(state=state)
        if self.present_var.get():
            self.end_period_var.set("")

    def load_projects(self) -> None:
        selected_file = self.current_file.name if self.current_file else ""
        self.project_items.clear()
        self.tree.delete(*self.tree.get_children())

        for file_path in project_files():
            try:
                project = json.loads(file_path.read_text(encoding="utf-8"))
            except Exception as error:
                project = {"title": f"Invalid JSON: {error}", "company": ""}

            self.project_items.append((file_path, project))
            label = str(project.get("title") or file_path.name)
            company = str(project.get("company") or "")
            title = f"{company} - {label}" if company else label
            self.tree.insert("", tk.END, iid=file_path.name, values=(title, file_path.name))

        if selected_file and self.tree.exists(selected_file):
            self.tree.selection_set(selected_file)

        self.status_var.set(f"Loaded {len(self.project_items)} project file(s).")

    def selected_path(self) -> Path | None:
        selected = self.tree.selection()
        if not selected:
            return None
        return PROJECTS_DIR / selected[0]

    def on_project_select(self, _event: object | None = None) -> None:
        path = self.selected_path()
        if not path or not path.exists():
            return

        try:
            project = json.loads(path.read_text(encoding="utf-8"))
        except Exception as error:
            messagebox.showerror("Invalid JSON", f"Could not read {path.name}:\n{error}")
            return

        self.current_file = path
        self.filename_var.set(path.name)
        self.populate_form(project)
        self.status_var.set(f"Editing {path.name}.")

    def populate_form(self, project: dict[str, object]) -> None:
        links = project.get("links", [])

        for field in FIELDS:
            value = project.get(field.key, "")

            if field.key == "links":
                value = format_links(value)
            elif field.key == "webUrl":
                value = next(
                    (
                        str(link.get("href", ""))
                        for link in links
                        if isinstance(link, dict) and link.get("type") == "web"
                    ),
                    str(project.get("companyUrl", "")),
                )
            elif field.key == "slug":
                value = ""
            else:
                value = str(value or "")

            self.set_field_value(field.key, value)

        start_period, end_period, present = split_period(str(project.get("period", "")))
        self.start_period_var.set(start_period)
        self.end_period_var.set(end_period)
        self.present_var.set(present)
        self.sync_present_state()
        self.list_editors["stack"].set_items(project.get("stack", []))
        self.list_editors["imageUrls"].set_items(project.get("imageUrls", []))
        self.list_editors["responsibilities"].set_items(project.get("responsibilities", []))
        self.list_editors["achievements"].set_items(project.get("achievements", []))
        self.featured_var.set(bool(project.get("featured", False)))

    def set_field_value(self, key: str, value: str) -> None:
        if key in self.text_widgets:
            widget = self.text_widgets[key]
            widget.delete("1.0", tk.END)
            widget.insert("1.0", value)
            return

        self.entry_vars[key].set(value)

    def get_field_value(self, key: str) -> str:
        if key in self.text_widgets:
            return self.text_widgets[key].get("1.0", tk.END).strip()
        return self.entry_vars[key].get().strip()

    def create_links_payload(self) -> list[dict[str, str]]:
        links = parse_links(self.get_field_value("links"))
        web_url = self.get_field_value("webUrl")

        if web_url and not any(link.get("href") == web_url for link in links):
            links.insert(0, {"label": "Web", "href": web_url, "type": "web"})

        return links

    def clear_form(self) -> None:
        for field in FIELDS:
            self.set_field_value(field.key, "")
        self.start_period_var.set("")
        self.end_period_var.set("")
        self.present_var.set(True)
        self.sync_present_state()
        for editor in self.list_editors.values():
            editor.set_items([])
        self.featured_var.set(True)

    def new_project(self) -> None:
        self.tree.selection_remove(self.tree.selection())
        self.current_file = None
        self.filename_var.set("New project")
        self.clear_form()
        self.status_var.set("Creating a new project.")

    def create_payload(self) -> dict[str, object]:
        title = self.get_field_value("title")
        description = self.get_field_value("description")
        stack = self.list_editors["stack"].get_items()
        impact = self.get_field_value("impact")

        if not title:
            raise ValueError("Project Title is required.")
        if not description:
            raise ValueError("Description is required.")
        if not stack:
            raise ValueError("At least one Stack item is required.")
        if not impact:
            raise ValueError("Impact is required.")

        project = {
            "title": title,
            "role": self.get_field_value("role"),
            "company": self.get_field_value("company"),
            "location": self.get_field_value("location"),
            "period": build_period(self.start_period_var.get(), self.end_period_var.get(), self.present_var.get()),
            "description": description,
            "stack": stack,
            "impact": impact,
            "links": self.create_links_payload(),
            "demoUrl": self.get_field_value("demoUrl"),
            "githubUrl": self.get_field_value("githubUrl"),
            "featured": self.featured_var.get(),
            "imageUrls": self.list_editors["imageUrls"].get_items(),
            "responsibilities": self.list_editors["responsibilities"].get_items(),
            "achievements": self.list_editors["achievements"].get_items(),
        }

        return clean_project(project)

    def create_new_file_path(self, project: dict[str, object]) -> Path:
        slug_source = self.get_field_value("slug") or " ".join(
            str(project.get(key, "")) for key in ("company", "title") if project.get(key)
        )
        slug = slugify(slug_source)

        if not slug:
            raise ValueError("A title or custom slug is required for the filename.")

        return PROJECTS_DIR / unique_filename(f"{next_index()}-{slug}.json")

    def save_project(self) -> None:
        try:
            project = self.create_payload()
            file_path = self.current_file or self.create_new_file_path(project)
            file_path.write_text(json.dumps(project, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        except Exception as error:
            messagebox.showerror("Save Project", str(error))
            return

        self.current_file = file_path
        self.filename_var.set(file_path.name)
        self.load_projects()
        self.tree.selection_set(file_path.name)
        self.status_var.set(f"Saved {file_path.name}.")
        messagebox.showinfo("Save Project", f"Saved {file_path.name}.")

    def delete_project(self) -> None:
        path = self.selected_path()

        if not path or not path.exists():
            messagebox.showwarning("Delete Project", "Select a project to delete.")
            return

        confirmed = messagebox.askyesno("Delete Project", f"Delete {path.name}?\n\nThis removes the JSON file.")

        if not confirmed:
            return

        try:
            path.unlink()
        except Exception as error:
            messagebox.showerror("Delete Project", str(error))
            return

        if self.current_file == path:
            self.new_project()

        self.load_projects()
        self.status_var.set(f"Deleted {path.name}.")


def main() -> int:
    PROJECTS_DIR.mkdir(parents=True, exist_ok=True)
    root = Tk()
    ProjectDataApp(root)
    root.mainloop()
    return 0


if __name__ == "__main__":
    sys.exit(main())
