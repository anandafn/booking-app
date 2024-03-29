import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = " http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("2@mail.com");
  await page.locator("[name=password]").fill("qwerty");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Successfully login")).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("test hotel");
  await page.locator('[name="city"]').fill("test city");
  await page.locator('[name="country"]').fill("test country");
  await page.locator('[name="description"]').fill("test description");
  await page.locator('[name="pricePerNight"]').fill("100");

  await page.selectOption('select[name="starRating"]', "3");

  await page.getByText("Budget").click();

  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Parking").check();

  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("1");

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "1.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForSelector("span", { state: "visible" });
});

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText("sanctum hotel")).toBeVisible();
  await expect(page.getByText("lorem ipsum")).toBeVisible();
  await expect(page.getByText("Jenewa, Swiss")).toBeVisible();
  await expect(page.getByText("Golf Resort")).toBeVisible();
  await expect(page.getByText("$120 per night")).toBeVisible();
  await expect(page.getByText("2 adults, 0 children")).toBeVisible();
  await expect(page.getByText("4 Star Rating")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("sanctum hotel");
  await page.locator('[name="name"]').fill("sanctum hotel UPDATED");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();

  await page.reload();

  await expect(page.locator('[name="name"]')).toHaveValue(
    "sanctum hotel UPDATED"
  );
  await page.locator('[name="name"]').fill("sanctum Hotel");
  await page.getByRole("button", { name: "Save" }).click();
});
