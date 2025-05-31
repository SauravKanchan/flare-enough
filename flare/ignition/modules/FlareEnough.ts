import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeployFactoryWithTestUSDC", (m) => {
  const testUSDC = m.contract("TestUSDC");
  const flareEnough = m.contract("FlareEnough", [testUSDC]);

  // Call createMarket on the FlareEnough contract
  const markets = [
    {
      name: "US Presidential Election 2025?",
      description: "The outcome of the 2024 US Presidential Election between candidates.",
      outcome1: "Trump wins",
      outcome2: "Biden wins",
      event_date: +new Date("2025-07-10T00:00:00Z"),
    },
    {
      name: "FED Interest Rate Decision",
      description: "The Federal Reserve decision on interest rates in December 2024.",
      outcome1: "Rate hike",
      outcome2: "Rate hold",
      event_date: +new Date("2025-07-15T00:00:00Z"),
    },
    {
      name: "Will ethereum etf be approved?",
      description: "Will the SEC approve an Ethereum ETF by the end of 2025?",
      outcome1: "Approved",
      outcome2: "Denied",
      event_date: +new Date("2025-12-31T23:59:59Z"),
    }
  ]

    markets.forEach((market) => {
        m.call(flareEnough, "createMarket", [
        market.name,
        market.description,
        market.outcome1,
        market.outcome2,
        market.event_date,
        ], {id: `createMarket_${market.event_date}`});
    });

  return { testUSDC, flareEnough };
});