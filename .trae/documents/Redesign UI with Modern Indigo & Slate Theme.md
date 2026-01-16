I will redesign the application with a modern **Indigo & Slate** theme. This involves updating the global color configuration, refining the UI components, and updating hardcoded colors in the pages.

### **1. Update Color Palette (`tailwind.config.js`)**
I will configure the Tailwind theme to use a modern color palette globally.
-   **Primary**: Map to **Indigo** (replacing the generic Blue).
-   **Gray**: Map to **Slate** (a cooler, more modern gray with blue undertones).
-   **Semantic Colors**: Define `success` (Emerald), `warning` (Amber), `danger` (Rose), and `info` (Sky) to ensure consistency.

### **2. Refine Global Styles (`index.css`)**
I will update the base styles and component classes to use the new palette and add modern touches.
-   **`.btn`**: Add subtle shadows (`shadow-sm`) and use the new `primary` and `danger` colors.
-   **`.input`**: Use lighter borders (`border-gray-200`) with the new Indigo focus ring.
-   **`.card`**: Add a subtle border (`border-gray-100`) to stand out on the `gray-50` background.
-   **`.badge-*`**: Update to use the new semantic colors (e.g., `bg-success-100 text-success-800`).

### **3. Update Sidebar Component (`Sidebar.jsx`)**
-   Update the active link background to `bg-primary-600`.
-   Update the Logout button to use `bg-danger-600` (Rose) instead of generic Red.
-   The background will automatically update to **Slate-900** due to the global config change.

### **4. Update Pages with Hardcoded Colors**
I will scan the key pages and replace hardcoded Tailwind color classes (like `green-500`, `yellow-500`) with the new semantic classes (`success-500`, `warning-500`) to ensure the theme is applied everywhere.
-   **`Dashboard.jsx` & `AdminDashboard.jsx`**: Update stats cards and status indicators.
-   **`TicketDetail.jsx`**: Update status badges and priority colors.
-   **`TechnicianDashboard.jsx`**: Update priority/status pills.
-   **`Tickets.jsx` & `AdminAllTickets.jsx`**: Update list item status colors.

### **5. Verification**
-   I will verify the changes by checking the file contents to ensure the new classes are correctly applied.
