import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from project root
app.use(express.static(process.cwd()));

// Page Routes for Clean URLs
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(process.cwd(), "about.html"));
});

app.get("/services", (req, res) => {
  res.sendFile(path.join(process.cwd(), "services.html"));
});

app.get("/reviews", (req, res) => {
  res.sendFile(path.join(process.cwd(), "reviews.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(process.cwd(), "contact.html"));
});

// API Routes
app.post("/api/quote", (req, res) => {
  const { propertyType, bedrooms, bathrooms, fuelType, currentBoiler, name, phone, email, postcode } = req.body;

  // Base price calculation logic
  let basePrice = 1650; // Standard combi replacement
  if (propertyType === "detached") basePrice += 300;
  if (propertyType === "semi") basePrice += 150;
  if (bedrooms === "4+") basePrice += 250;
  if (bathrooms === "3+") basePrice += 200;
  if (currentBoiler === "backBoiler") basePrice += 450; // Conversion cost

  const refNumber = "OH-" + Math.floor(100000 + Math.random() * 900000);

  res.json({
    success: true,
    refNumber,
    estimatedPrice: `£${basePrice.toLocaleString()} - £${(basePrice + 450).toLocaleString()}`,
    monthlyFinance: `£${Math.round(basePrice / 60)}/mo (0% Interest for 12 mos)`,
    details: {
      propertyType: propertyType || "Home",
      bedrooms: bedrooms || "3",
      bathrooms: bathrooms || "1",
      brandRecommended: "Worcester Bosch Greenstar 4000 (10-Yr Guarantee)",
      guarantee: "10 Years Parts & Labour Warranty"
    },
    message: `Thank you, ${name || "Customer"}. Your fixed-price quote estimate for postcode ${postcode || "NI"} has been calculated. One of our Gas Safe engineers will call you at ${phone || "your phone"} within 30 minutes.`
  });
});

app.post("/api/contact", (req, res) => {
  const { name, phone, email, service, postcode, message } = req.body;
  const ticketRef = "OH-CONT-" + Math.floor(10000 + Math.random() * 90000);

  res.json({
    success: true,
    ticketRef,
    message: `Thank you ${name || "Customer"}. Your inquiry regarding ${service || "Heating Services"} (Ref: ${ticketRef}) has been received. Our Northern Ireland emergency callout team will contact you at ${phone || "your number"} shortly.`
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Original Heating Limited server running at http://0.0.0.0:${PORT}`);
});
