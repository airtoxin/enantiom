module.exports = async (page, browser, context) => {
  try {
    await page.click("#favbox-6");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch {}
};
