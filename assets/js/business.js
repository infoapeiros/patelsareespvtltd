(() => {
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (!el || value == null) return;
    el.textContent = String(value);
  };

  const setHref = (id, value) => {
    const el = document.getElementById(id);
    if (!el || !value) return;
    el.setAttribute("href", String(value));
  };

  const setAddress = (id, lines) => {
    const el = document.getElementById(id);
    if (!el || !Array.isArray(lines)) return;
    el.innerHTML = lines
      .filter(Boolean)
      .map((l) => String(l).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"))
      .join("<br />\n");
  };

  const normalizeDigits = (value) => String(value ?? "").replace(/\D/g, "");

  fetch("business.json", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Failed to load business.json (${r.status})`))))
    .then((b) => {
      setText("biz-name", b.name);
      setText("biz-subtitle", b.subtitle);
      setText("biz-title", b.name);

      setAddress("biz-address", b.addressLines);

      setText("biz-email", b.email);
      setHref("biz-email-link", b.email ? `mailto:${b.email}` : "");

      setText("biz-phone", b.phone);
      setHref("biz-phone-link", b.phone ? `tel:${normalizeDigits(b.phone)}` : "");

      const waDigits = normalizeDigits(b.whatsapp || b.phone);
      setText("biz-whatsapp", b.whatsapp || b.phone);
      setHref("biz-whatsapp-link", waDigits ? `https://wa.me/${waDigits}` : "");

      setHref("biz-maps-link", b.mapsUrl);
    })
    .catch(() => {
      // If business.json isn't present/valid, keep the HTML defaults.
    });
})();
