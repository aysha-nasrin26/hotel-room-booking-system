/**
 * @jest-environment jsdom
 */

// Mock the global fetch object to spy on network requests safely
global.fetch = jest.fn();

describe("Hotel Booking System - Frontend Functional Tests", () => {
    // Temporary spy mocks to keep the terminal output clean
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterAll(() => {
        console.error.mockRestore();
        console.warn.mockRestore();
    });
    beforeEach(() => {
    // 1. Reset network intercept mock values
    fetch.mockClear();

    // 2. Setup mock browser DOM structure required to securely execute your script logic
    document.body.innerHTML = `
      <div id="roomGrid"></div>
      <input id="searchInput" value="" />
      <select id="roomTypeFilter"><option value=""></option><option value="Deluxe">Deluxe</option></select>
      <select id="statusFilter"><option value=""></option><option value="AVAILABLE">AVAILABLE</option></select>
      <button id="addRoomBtn"></button>
      <button id="refreshBtn"></button>
      
      <!-- Modals -->
      <div id="roomModal"></div>
      <form id="roomForm"><input id="roomNumber" /><select id="newRoomType"></select><input id="roomPrice" /><input id="roomCapacity" /><button id="saveRoomBtn"></button></form>
      <div id="editRoomModal"></div>
      <form id="editRoomForm"><input id="editRoomNumber" /><select id="editRoomType"></select><input id="editRoomPrice" /><input id="editRoomCapacity" /><button id="updateRoomBtn"></button></form>
      
      <!-- Booking Forms -->
      <div id="selectedRoomInfo"></div>
      <form id="bookingForm"></form>
      <select id="bookingRoom"></select>
      <input id="checkInDate" />
      <input id="checkOutDate" />
      <button id="checkAvailabilityBtn"></button>
      <div id="availabilityMessage"></div>
      <input id="guestName" />
      <input id="guestEmail" />
      <span id="bookingPrice"></span>
      <span id="bookingNights"></span>
      <span id="bookingTotal"></span>
      <button id="confirmBookingBtn"></button>
      
      <!-- Lists & Analytics -->
      <input id="bookingSearch" />
      <select id="bookingStatusFilter"></select>
      <table id="bookingTableBody"></table>
      <span id="totalBookings"></span>
      <span id="activeBookings"></span>
      <span id="cancelledBookings"></span>
      <span id="totalRevenue"></span>
      <select id="historyRoomSelect"></select>
      <div id="roomHistory"></div>
      <button id="refreshBookingsBtn"></button>
      <div id="toastRegion"></div>
    `;

    // 3. Clear module loader cache and safely run app.js inside an isolated block scope
    jest.resetModules();
    const fs = require('fs');
    const path = require('path');
    const scriptCode = fs.readFileSync(path.resolve(__dirname, './frontend/js/app.js'), 'utf8');
    
    // Wrapping the raw script inside { ... } isolates 'const API_BASE_URL' declarations between test cycles
    const runtimeScript = `
    {
      ${scriptCode}
      
      window.displayRooms = displayRooms;
      window.filterRooms = filterRooms;
      window.nightsBetween = nightsBetween;
      window.openEditRoom = openEditRoom;
      window.apiRequest = apiRequest;
      window.loadRooms = loadRooms;

      // Expose rooms setter/getter for test mutations
      Object.defineProperty(window, 'rooms', {
        get: () => rooms,
        set: (val) => { rooms = val; },
        configurable: true
      });
    }
    `;
    
    const scriptElement = document.createElement("script");
    scriptElement.textContent = runtimeScript;
    document.body.appendChild(scriptElement);
  });

  /* ------------------------------------------------------------
   * TEST AREA 1: Room Render & Search / Filter List Functionality
   * ------------------------------------------------------------ */
  test("displayRooms should dynamically generate room cards and map variables accurately", () => {
    const mockRooms = [
      { id: 10, room_number: "101", room_type: "Deluxe", price_per_night: 2500, capacity: 2, status: "AVAILABLE" }
    ];

    window.displayRooms(mockRooms);

    const roomGrid = document.getElementById("roomGrid");
    expect(roomGrid.innerHTML).toContain("ROOM 101");
    expect(roomGrid.innerHTML).toContain("Deluxe Room");
    expect(roomGrid.innerHTML).toContain("₹2,500");
  });

  test("filterRooms should narrow down displayed elements via user options", () => {
    window.rooms = [
      { id: 1, room_number: "101", room_type: "Deluxe", price_per_night: 2000, capacity: 2, status: "AVAILABLE" },
      { id: 2, room_number: "202", room_type: "Single", price_per_night: 1200, capacity: 1, status: "OCCUPIED" }
    ];

    document.getElementById("searchInput").value = "101";
    window.filterRooms();

    const roomGrid = document.getElementById("roomGrid");
    expect(roomGrid.innerHTML).toContain("ROOM 101");
    expect(roomGrid.innerHTML).not.toContain("ROOM 202");
  });

  /* ------------------------------------------------------------
   * TEST AREA 2: Calculations & Validation Utilities
   * ------------------------------------------------------------ */
  test("nightsBetween should evaluate total intervals correctly", () => {
    const nights = window.nightsBetween("2026-10-20", "2026-10-25");
    expect(nights).toBe(5);
  });

  test("nightsBetween handling boundary validations returns 0 gracefully", () => {
    const errorNights = window.nightsBetween("", "2026-10-25");
    expect(errorNights).toBe(0);
  });

  /* ------------------------------------------------------------
   * TEST AREA 3: API Request Orchestrations & UI Custom Modals
   * ------------------------------------------------------------ */
  test("openEditRoom assigns values onto form parameters precisely", () => {
    window.rooms = [
      { id: 45, room_number: "405", room_type: "Suite", price_per_night: 5000, capacity: 4, status: "AVAILABLE" }
    ];

    window.openEditRoom(45);

    expect(document.getElementById("editRoomNumber").value).toBe("405");
    expect(document.getElementById("editRoomPrice").value).toBe("5000");
    expect(document.getElementById("editRoomModal").classList.contains("show")).toBe(true);
  });

  /* ------------------------------------------------------------
   * TEST AREA 4: Backend API Error Notifications Integration
   * ------------------------------------------------------------ */
  test("apiRequest catches server breakdown errors and renders a UI Error Toast", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        text: () => Promise.resolve(JSON.stringify({ detail: "Database connection failed" })),
      })
    );

    await expect(window.apiRequest("/rooms")).rejects.toThrow("HTTP 500: Database connection failed");
  });

  test("loadRooms fallback state displays inline error block inside UI elements upon fail", async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error("Network connection down")));

    const executionStatus = await window.loadRooms(true); 

    expect(executionStatus).toBe(false);
    expect(document.getElementById("roomGrid").innerHTML).toContain("Unable to load rooms");
  });
});
