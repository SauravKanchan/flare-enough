# 🔥 FlareEnough

**FlareEnough** is an event-driven options DEX built on the [Flare Network](https://flare.xyz), allowing users to trade options based on real-world event outcomes—not just expiry dates. Whether it's an election, sports match, or economic decision, FlareEnough creates parallel option markets tied to each possible outcome. Traders choose the timeline they believe in, and only the timeline matching reality settles—others are discarded, with funds refunded.

🌐 Live: [https://flare-enough.vercel.app](https://flare-enough.vercel.app)  
📦 GitHub: [https://github.com/SauravKanchan/flare-enough](https://github.com/SauravKanchan/flare-enough)

---

## 🚀 Overview

Traditional options DEXs lock all participants into a single expiry timeline. **FlareEnough** introduces a novel approach by allowing users to trade **conditionally** on specific outcomes of real-world events. Each outcome has a corresponding "timeline"—a fully functional market for that hypothetical reality.

For example, during the US election:
- Timeline A: “Trump Wins”
- Timeline B: “Trump Loses”

Users trade options within their chosen timeline. Once the event concludes, **Flare’s oracle infrastructure** determines the actual outcome:
- Trades on the correct timeline settle normally using **FTSO**
- Trades on the incorrect timeline are canceled, and all premiums and collateral are returned

---

## 🧱 Architecture

- **Smart Contracts** (Solidity):
  - Handle option creation, trading, collateralization, and conditional settlement
  - Separate timelines per event outcome

- **Flare Oracle Integration**:
  - Uses **FDC (Flare Data Connector)** to fetch and store event data on-chain
  - Uses **FTSO (Flare Time Series Oracle)** to securely settle options and validate outcome conditions

- **Frontend**:
  - Built with **React + Vite**
  - Enables intuitive timeline selection and trade execution


---

## ✨ Features

- 🕐 **Event-Conditional Timelines** – Trade only when your assumed outcome occurs  
- 🛡 **Oracle-Secured Outcomes** – Powered by Flare's decentralized data feeds  
- 🔁 **Refundable Markets** – Untriggered timelines refund collateral and premiums  
- 📈 **Options Trading** – Supports call/put options across real-world scenarios  
- 🧩 **Composable Architecture** – Easily plug in new event types and timelines  

---


### Install & Run

```bash
git clone https://github.com/SauravKanchan/flare-enough.git
cd flare-enough
npm install
npm run dev
```

## ⚠️ Assumptions

This is an early-stage prototype of FlareEnough. The following assumptions have been made to simplify development and demonstrate core functionality:

1. **Mocked Event Data**  
   Event outcomes are currently provided by a mock server instead of real-time oracle data from Flare FDC.

2. **Hardcoded Option Seller**  
   To avoid the complexity of matching orders or building an AMM, the seller is hardcoded for now.

3. **Simulated Order Book**  
   The option market displays hardcoded strike prices and simulates buyer/seller presence. This is due to the absence of active market participants.  
   > ⚠️ **Note**: The **actual logic for buying and selling options is fully implemented**—only the display is simulated for better UX.
