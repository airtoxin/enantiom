module.exports = async (page, browser, context) => {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
};
