// Pone el nombre del negocio (?n=Nombre-Negocio) en <title> y Open Graph,
// para que la vista previa de WhatsApp/Facebook muestre el nombre correcto.
const DEFAULT_NAME = "Jardín de Eventos";
const FIX = { Jardin: "Jardín", jardin: "jardín", Salon: "Salón", salon: "salón", Recepcion: "Recepción" };
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (raw) => raw ? raw.replace(/[-_+]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 60)
  .split(" ").map((w) => FIX[w] || w).join(" ") : "";

export default async (request, context) => {
  const url = new URL(request.url);
  const response = await context.next();
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;
  const name = clean(url.searchParams.get("n") || "");
  let html = await response.text();
  const cut = html.indexOf("</head>");
  let head = html.slice(0, cut), body = html.slice(cut);
  if (name) head = head.split(DEFAULT_NAME).join(esc(name));
  head = head.replace("https://propuesta-salon-eventos.netlify.app/og.jpg", `${url.origin}/og.jpg`);
  if (name) body = body.split(">" + DEFAULT_NAME + "<").join(">" + esc(name) + "<");
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(head + body, { status: response.status, headers });
};

export const config = { path: ["/", "/index.html"] };
