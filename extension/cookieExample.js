module.exports = async ({ page }) => {
  const url = "https://bp-5215.preprod.basis.net/dashboard";

  const cookies = [
    {
      name: "_main_session",
      domain: "bp-5215.preprod.basis.net",
      // "path":"/",
      // "expires":-1,
      // "httpOnly":false,
      // "secure":true,
      // "session":true,
      value:
        "eU9OejdYenpCQmZCVmErNW4vOXZpRUtZWEJHbHRVbmZ4WGVyRUhGRXJkRkhPU0VmU3hQaTJDMngzRGhGUEcvYWlLcGtWTTlhbWdWdzFCV3RFSlZnYjl4cEVmTjF6ZDk3cW5Cd09KZ04wbGFuSUExNE1MOGlaKytxUzBaVGR0V0YrY25WdklVeDltUU4xYWE2SUpiQjJDbG9XcFZlbGQ2SlNZNTNXT1R0YWFFdmMyWjZkZG1XQkMwOEZxY2M1SVpuTGVHVVJWS3IyZktIVTJzaGlwdEVyclFGbHdwdWNyaWpwb0VJb2NaUDIrWjExMzA1bDlHajJKSzZoRkZNUnlOSzhTRjAvUEt3NE0zTXBwMFloVnZtbWxZc004UkVmdkFnVEZlS1Y4dXZrRUt4MHNpSWN6VDB1TWI4Y0ZvWVBPV09KU25RY3FrUVMyZlk4N0QyRGZNZUVwYVNyMFNFOHVPVW9kc3lFcklKS2FXZWIzRURRbklFKzBqTGlJUXFFelF1RXl4VzhzNHlVNC85c21zb3NWa1FSV3RaazVibUxDTGVhVUdUVTNCbkdqbU9CdGJFK0s3TzYvZk5hcUVwd016Z1p2Yi9TWXIwS3V6MDRPYXU5Nll6dzJkVUcxRXhQWHZqTmFpQmtRYlRvQm1hbU9PS0gwVGNxUEgvdFNuZWEvc3dGeHFONHVDVVVFajRVK2xRTHZoeVBENG5DM0doeVJWMjdZaDVwVjhMR1ExWmlXem9WaTdPS3NkZjVOU1hzWHVUQnNxb2NKbU9jS2JxMy9TNlVmcGlSK0xqanZBVUsxb0xhUHRIR0xuSmV4M1laSks4Rzh0M2VIcDZIemNlenV6ZFRHWTVUYVpGSlpiMlJHZ2xaeUdSL3JQMXlGQng1bTVvMmd4UkUzVTdTUzlGZjg3VkNvaXU2VmE1SW14Z1NnSzRjRHlqcXpaYitCRWEwUWdZRDZUNVZFc2lONTVPYTQvL1AzSlNsRWVsajNTRTRNaEh3NEpabDByNzZONEZ4cVJNV09oVDh3d084UkhSTjNFSEVHdDVzbU5IRDJZWmxOWW9IUFNENGFEV1kwVFFIR1NsZTF5enp3NGNRM2xtUkVnM0VOWlpkQ3RiRDJBcWJMRTRQd1RneU1YNmFjejRCeERkVWY2R0ZpWjc4UlQyOWh1VklmaWhxMmZTY2FoTE9jNlE0NnBGSFJqejlSQ24wZVo5SWx5bjV3PT0tLXV3TWdZK3lGek5YVXNOU0IvcVVab1E9PQ%3D%3D--53d32adab135fb1a3c5083862e93488f9297ccea"
    }
  ];

  await page.setCookie(...cookies);
  await page.goto(url);

  const cookiesSet = await page.cookies(url);
  console.log(JSON.stringify(cookiesSet));
};
