# HelixAero Ops Suite

> **Innovation in Flight**
>
> Bridging the critical gap between Avionic ATC and Maintenance Management Systems with real-time monitoring, predictive analytics, and comprehensive compliance tracking.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)

## 📋 Features

| Feature | Description | Key Benefit |
| :--- | :--- | :--- |
| **Real-Time Monitoring** | Live ATC data integration with aircraft telemetry and health monitoring. | Immediate situational awareness. |
| **Predictive Maintenance** | AI-powered analytics for proactive maintenance scheduling and fault detection. | Reduces downtime and costs. |
| **Compliance Tracking** | Automated regulatory compliance with blockchain-anchored audit trails. | Ensures adherence to DO-178C/ARINC 653. |
| **Fleet Management** | Comprehensive aircraft status, work orders, and inventory management. | Streamlined operations. |

## 🛠️ Tech Stack

| Category | Technology | Version |
| :--- | :--- | :--- |
| **Framework** | Next.js | 15.2.4 |
| **UI Library** | React | 19 |
| **Styling** | Tailwind CSS | 4.1.9 |
| **Icons** | Lucide React | 0.454.0 |
| **Charts** | Recharts | Latest |
| **Validation** | Zod | 3.25.76 |
| **Forms** | React Hook Form | 7.60.0 |

## 🔄 System Architecture

The following sequence diagram illustrates the high-level data flow between the Aircraft, ATC, and the HelixAero Ops Suite.

```mermaid
sequenceDiagram
    participant A as Aircraft
    participant ATC as Air Traffic Control
    participant H as HelixAero Ops Suite
    participant M as Maintenance Team

    Note over A, H: Real-Time Telemetry Stream

    A->>ATC: Transmit Flight Data (Location, Alt, Speed)
    A->>H: Transmit Health Telemetry (Engine, Hydraulics)
    
    ATC->>H: Forward ATC Context (Route, Weather)
    
    activate H
    H->>H: Analyze Data (AI/ML Engine)
    
    alt Critical Fault Detected
        H-->>M: Alert: Immediate Maintenance Required
        H-->>ATC: Notify: Request Priority Landing
    else Routine Status
        H->>H: Log Data to Blockchain Ledger
    end
    deactivate H

    M->>H: Acknowledge Alert / Schedule Work Order
    H->>A: Update Maintenance Status
```

## 🗺️ User Workflow

This flowchart depicts the typical user journey for an Operations Manager using the suite.

```mermaid
flowchart TD
    Start([Start]) --> Login{Authenticated?}
    
    Login -- No --> SignUp[Sign Up / Login Page]
    SignUp --> Login
    
    Login -- Yes --> Dashboard[Access Main Dashboard]
    
    Dashboard --> Monitor[Real-Time Monitoring]
    Dashboard --> Fleet[Fleet Management]
    Dashboard --> Analytics[Predictive Analytics]
    
    Monitor --> Alert{Critical Alert?}
    Alert -- Yes --> Action[Initiate Emergency Protocol]
    Alert -- No --> Log[Log Status]
    
    Fleet --> WorkOrder[Create/View Work Orders]
    
    Analytics --> Report[Generate Health Report]
    
    Action --> End([End Session])
    Log --> End
    WorkOrder --> End
    Report --> End
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-org/helixaero-ops-suite.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd helixaero-ops-suite
    ```
3.  Install dependencies:
    ```bash
    pnpm install
    ```

### Running Locally

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

