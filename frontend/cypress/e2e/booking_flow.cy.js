describe('Hotel Booking System - End-to-End Functional Flow', () => {
  
  beforeEach(() => {
    // 1. Visit your frontend home page
    cy.visit('/index.html'); 
  });

  it('Should load rooms from database, search, and handle a live validation flow', () => {
    // 2. Verify that rooms are loaded from your real FastAPI + Postgres/MySQL setup
    cy.get('#roomGrid').should('not.contain', 'Unable to load rooms');
    cy.get('.room-card').should('have.length.at.least', 1);

    // 3. Test Room Search Functionality
    // Type a known room number or character and see if UI filters react
    cy.get('#searchInput').type('101');
    cy.get('#roomGrid').should('contain', '101');

    // 4. Test Booking Form Interaction and Calculations
    // Pick the first available room's book button
    cy.get('.room-card').first().find('button[data-action="book"]').click();

    // Fill the booking fields
    cy.get('#checkInDate').type('2026-11-01');
    cy.get('#checkOutDate').type('2026-11-05');
    
    // Trigger availability check request to FastAPI
    cy.get('#checkAvailabilityBtn').click();

    // Verify the nights validation calculated correctly on the UI
    cy.get('#bookingNights').should('have.text', '4');

    // Fill guest parameters
    cy.get('#guestName').type('Yuva Intern');
    cy.get('#guestEmail').type('intern@example.com');

    // 5. Test Live Form Validation & Error Message handling
    // Let's clear checkout date to trigger an API/Frontend validation failure flow
    cy.get('#checkOutDate').clear();
    cy.get('#confirmBookingBtn').click({ force: true });
    
    // 1. Verify that form submission was intercepted or blocked, keeping the booking active
    cy.get('#bookingForm').should('be.visible');

    // 2. Alternatively, test your app's custom toast notification by explicitly feeding an invalid text field
    cy.get('#guestEmail').clear().type('invalid-email-format');
    cy.get('#confirmBookingBtn').click({ force: true });
  });

  it('Should handle Room Edit modal workflow flawlessly', () => {
    // Open the Edit Modal for a room
    cy.get('.room-card').first().find('button[data-action="edit"]').click();

    // Verify Modal container transitions correctly into view
    cy.get('#editRoomModal').should('have.class', 'show');

    // Change price parameter
    cy.get('#editRoomPrice').clear().type('3500');

    // Close Modal safely using cancel layout triggers
    cy.get('#cancelEditBtn').click();
    cy.get('#editRoomModal').should('not.have.class', 'show');
  });
});
