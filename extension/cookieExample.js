module.exports = async ({ page }) => {
  const url = "https://bp5310.preprod.basis.net/dashboard";

  const cookies = [
    {
      name: "_main_session",
      domain: "bp5310.preprod.basis.net",
      // "path":"/",
      // "expires":-1,
      // "httpOnly":false,
      // "secure":true,
      // "session":true,
      value:
        "dXNUdGx2M2NvcEk4TDVBV3NlOWpVM0tHWW95aWVNcFI4TVFyMVAxSUVPcm5sWUdBQTQrck5SVFlNVGkvdTR0L1FCZ0I3Y0dPODI3L04rcVcwQ0lScGVvanJOUVZkejZya3JFYjBScGJUc1h4NHdGUGlPY1FCejAxbW9iajFjNnRDRi9pTU1RaFpGUWZib1UvU2dTZTNmbXJGWWNuMVYzMmNDWXcxTkY0RWhNM3RyUTJER2pkM3duNnc2Q1RUbWRIdlQrM0Z0a0FxbGcwSGpDWFBTS1NLQjBvL2J2eExHckpxSFFKK3FqZ09CcHFnRytNOHNMbVhTMURuNHRvZ0puZWIyVTlJT2ZzcHRiUjV1NkErQUJXZVFqV3JpZ0JnM1VvTDVIcU5RSHNkYlk4emVjaE9WZnNRV2d6bkVCMmlQMEdsQ1JnWjQxeGkrVkxUaTY1UHV0U09RV1B1cHBJS0xqcTkrV3VyVTFsQ3JlKzVGWS9PbWpmYmxrUzl1VEFEa2RNUkEwSXFWa2NjTmt1ZW5UZHVKZlFqd0hMUG1Ndlg1alp6TndrY3dNZ3d0R202UG9xT1VwTDU4ZEdJWmNNYXZ1S2NCaDU3NGREQjY4UEZXWEhwMEN4M1FoWHlYVnRrL0VINllxZ2toc2VOaUU9LS1WSExieEUrWlB1STU1Zk5laDZ6VE9RPT0%3D--da09baeeef934b889cfa6c317f43dbcdb0f5be92"
    }
  ];

  await page.setCookie(...cookies);
  await page.goto(url);

  const cookiesSet = await page.cookies(url);
  console.log(JSON.stringify(cookiesSet));
};
