// =====================================================
// HOTEL ROOM BOOKING SYSTEM
// FRONTEND APPLICATION
// =====================================================


// =====================================================
// ROOM DATA
// =====================================================

const rooms = [

    {
        roomNumber: "101",
        roomType: "Single",
        capacity: 1,
        price: 2500,
        status: "AVAILABLE"
    },

    {
        roomNumber: "202",
        roomType: "Double",
        capacity: 2,
        price: 3500,
        status: "BOOKED"
    },

    {
        roomNumber: "305",
        roomType: "Deluxe",
        capacity: 3,
        price: 5000,
        status: "AVAILABLE"
    }

];


// =====================================================
// BOOKING DATA
// =====================================================

const bookings = [];


// =====================================================
// DOM ELEMENTS
// =====================================================


// Room Catalog

const roomGrid =
    document.getElementById("roomGrid");

const searchInput =
    document.getElementById("searchInput");

const roomTypeFilter =
    document.getElementById("roomTypeFilter");

const statusFilter =
    document.getElementById("statusFilter");


// Add Room

const addRoomBtn =
    document.getElementById("addRoomBtn");

const roomModal =
    document.getElementById("roomModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelRoomBtn =
    document.getElementById("cancelRoomBtn");

const roomForm =
    document.getElementById("roomForm");


// Edit Room

const editRoomModal =
    document.getElementById("editRoomModal");

const closeEditModalBtn =
    document.getElementById("closeEditModalBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const editRoomForm =
    document.getElementById("editRoomForm");

const editRoomNumber =
    document.getElementById("editRoomNumber");

const editRoomType =
    document.getElementById("editRoomType");

const editRoomPrice =
    document.getElementById("editRoomPrice");

const editRoomCapacity =
    document.getElementById("editRoomCapacity");


// Booking

const bookingRoom =
    document.getElementById("bookingRoom");

const checkInDate =
    document.getElementById("checkInDate");

const checkOutDate =
    document.getElementById("checkOutDate");

const guestName =
    document.getElementById("guestName");

const guestEmail =
    document.getElementById("guestEmail");

const checkAvailabilityBtn =
    document.getElementById("checkAvailabilityBtn");

const availabilityMessage =
    document.getElementById("availabilityMessage");

const bookingPrice =
    document.getElementById("bookingPrice");

const bookingNights =
    document.getElementById("bookingNights");

const bookingTotal =
    document.getElementById("bookingTotal");

const confirmBookingBtn =
    document.getElementById("confirmBookingBtn");

const bookingForm =
    document.getElementById("bookingForm");

const selectedRoomInfo =
    document.getElementById("selectedRoomInfo");


// Management

const bookingSearch =
    document.getElementById("bookingSearch");

const bookingStatusFilter =
    document.getElementById("bookingStatusFilter");

const bookingTableBody =
    document.getElementById("bookingTableBody");

const totalBookings =
    document.getElementById("totalBookings");

const activeBookings =
    document.getElementById("activeBookings");

const cancelledBookings =
    document.getElementById("cancelledBookings");

const totalRevenue =
    document.getElementById("totalRevenue");

const historyRoomSelect =
    document.getElementById("historyRoomSelect");

const roomHistory =
    document.getElementById("roomHistory");


// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function scrollToSection(sectionId) {

    const section =
        document.getElementById(sectionId);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


function formatCurrency(amount) {

    return `₹${Number(amount).toLocaleString("en-IN")}`;

}


function calculateNights(checkIn, checkOut) {

    const start =
        new Date(checkIn);

    const end =
        new Date(checkOut);

    const difference =
        end - start;

    return difference /
        (1000 * 60 * 60 * 24);

}


function getSelectedRoom() {

    return rooms.find(
        room =>
            room.roomNumber ===
            bookingRoom.value
    );

}


// =====================================================
// ROOM CATALOG
// =====================================================

function displayRooms(roomList) {

    roomGrid.innerHTML = "";


    if (roomList.length === 0) {

        roomGrid.innerHTML = `
            <p class="no-results">
                No rooms found.
            </p>
        `;

        return;

    }


    roomList.forEach(room => {

        const card =
            document.createElement("div");

        card.className =
            "room-card";


        card.innerHTML = `

            <div class="room-card-header">

                <span class="room-number">
                    Room ${room.roomNumber}
                </span>

                <span
                    class="status ${room.status.toLowerCase()}"
                >
                    ${room.status}
                </span>

            </div>


            <h3>
                ${room.roomType} Room
            </h3>


            <p class="room-description">

                Comfortable
                ${room.roomType.toLowerCase()}
                room suitable for
                ${room.capacity} guest(s).

            </p>


            <div class="room-details">

                <span>
                    👤 ${room.capacity} Guest(s)
                </span>

                <span>
                    ${formatCurrency(room.price)}
                    / night
                </span>

            </div>


            <div class="room-actions">

                <button
                    type="button"
                    class="edit-btn"
                    onclick="editRoom('${room.roomNumber}')"
                >
                    Edit
                </button>


                <button
                    type="button"
                    class="book-btn"
                    ${
                        room.status !== "AVAILABLE"
                            ? "disabled"
                            : ""
                    }
                    onclick="selectRoomForBooking('${room.roomNumber}')"
                >

                    ${
                        room.status === "AVAILABLE"
                            ? "Book Room"
                            : "Unavailable"
                    }

                </button>

            </div>

        `;


        roomGrid.appendChild(card);

    });

}


function filterRooms() {

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedType =
        roomTypeFilter.value;

    const selectedStatus =
        statusFilter.value;


    const filteredRooms =
        rooms.filter(room => {

            const matchesSearch =
                room.roomNumber
                    .toLowerCase()
                    .includes(searchValue);


            const matchesType =
                selectedType === "" ||
                room.roomType === selectedType;


            const matchesStatus =
                selectedStatus === "" ||
                room.status === selectedStatus;


            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            );

        });


    displayRooms(filteredRooms);

}


searchInput.addEventListener(
    "input",
    filterRooms
);


roomTypeFilter.addEventListener(
    "change",
    filterRooms
);


statusFilter.addEventListener(
    "change",
    filterRooms
);


// =====================================================
// ADD ROOM
// =====================================================

addRoomBtn.addEventListener(
    "click",
    function () {

        roomModal.classList.add("show");

    }
);


closeModalBtn.addEventListener(
    "click",
    function () {

        roomModal.classList.remove("show");

        roomForm.reset();

    }
);


cancelRoomBtn.addEventListener(
    "click",
    function () {

        roomModal.classList.remove("show");

        roomForm.reset();

    }
);


roomForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const roomNumber =
            document
                .getElementById("roomNumber")
                .value
                .trim();


        const roomType =
            document
                .getElementById("newRoomType")
                .value;


        const price =
            Number(
                document
                    .getElementById("roomPrice")
                    .value
            );


        const capacity =
            Number(
                document
                    .getElementById("roomCapacity")
                    .value
            );


        if (!roomNumber) {

            alert(
                "Room number is required."
            );

            return;

        }


        if (!roomType) {

            alert(
                "Please select a room type."
            );

            return;

        }


        if (price <= 0) {

            alert(
                "Price must be greater than 0."
            );

            return;

        }


        if (capacity <= 0) {

            alert(
                "Capacity must be greater than 0."
            );

            return;

        }


        const duplicateRoom =
            rooms.some(
                room =>
                    room.roomNumber ===
                    roomNumber
            );


        if (duplicateRoom) {

            alert(
                "Room number already exists."
            );

            return;

        }


        const newRoom = {

            roomNumber:
                roomNumber,

            roomType:
                roomType,

            capacity:
                capacity,

            price:
                price,

            status:
                "AVAILABLE"

        };


        rooms.push(newRoom);


        filterRooms();

        loadBookingRooms();

        loadHistoryRoomOptions();


        roomModal.classList.remove(
            "show"
        );


        roomForm.reset();


        alert(
            "Room added successfully!"
        );

    }
);


// =====================================================
// EDIT ROOM
// =====================================================

function editRoom(roomNumber) {

    const room =
        rooms.find(
            room =>
                room.roomNumber ===
                roomNumber
        );


    if (!room) {

        alert(
            "Room not found."
        );

        return;

    }


    editRoomNumber.value =
        room.roomNumber;


    editRoomType.value =
        room.roomType;


    editRoomPrice.value =
        room.price;


    editRoomCapacity.value =
        room.capacity;


    editRoomModal.classList.add(
        "show"
    );

}


editRoomForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const roomNumber =
            editRoomNumber.value;


        const room =
            rooms.find(
                room =>
                    room.roomNumber ===
                    roomNumber
            );


        if (!room) {

            alert(
                "Room not found."
            );

            return;

        }


        const newPrice =
            Number(
                editRoomPrice.value
            );


        const newCapacity =
            Number(
                editRoomCapacity.value
            );


        if (newPrice <= 0) {

            alert(
                "Price must be greater than 0."
            );

            return;

        }


        if (newCapacity <= 0) {

            alert(
                "Capacity must be greater than 0."
            );

            return;

        }


        room.roomType =
            editRoomType.value;


        room.price =
            newPrice;


        room.capacity =
            newCapacity;


        filterRooms();

        loadBookingRooms();


        editRoomModal.classList.remove(
            "show"
        );


        editRoomForm.reset();


        alert(
            "Room updated successfully!"
        );

    }
);


closeEditModalBtn.addEventListener(
    "click",
    function () {

        editRoomModal.classList.remove(
            "show"
        );

        editRoomForm.reset();

    }
);


cancelEditBtn.addEventListener(
    "click",
    function () {

        editRoomModal.classList.remove(
            "show"
        );

        editRoomForm.reset();

    }
);


// =====================================================
// MODAL OUTSIDE CLICK
// =====================================================

roomModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            roomModal
        ) {

            roomModal.classList.remove(
                "show"
            );

            roomForm.reset();

        }

    }
);


editRoomModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            editRoomModal
        ) {

            editRoomModal.classList.remove(
                "show"
            );

            editRoomForm.reset();

        }

    }
);


// =====================================================
// BOOKING PAGE
// =====================================================

function loadBookingRooms() {

    bookingRoom.innerHTML = `

        <option value="">
            Select a room
        </option>

    `;


    rooms
        .filter(
            room =>
                room.status ===
                "AVAILABLE"
        )
        .forEach(room => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                room.roomNumber;


            option.textContent =
                `Room ${room.roomNumber} -
                 ${room.roomType} -
                 ${formatCurrency(room.price)}
                 / night`;


            bookingRoom.appendChild(
                option
            );

        });

}


function selectRoomForBooking(
    roomNumber
) {

    const room =
        rooms.find(
            room =>
                room.roomNumber ===
                roomNumber
        );


    if (!room) {

        return;

    }


    bookingRoom.value =
        room.roomNumber;


    updateSelectedRoom();


    scrollToSection(
        "booking"
    );

}


function updateSelectedRoom() {

    const room =
        getSelectedRoom();


    if (!room) {

        selectedRoomInfo.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🏨
                </div>

                <p>
                    Select an available room
                    to begin your booking.
                </p>

            </div>

        `;


        bookingPrice.textContent =
            "₹0";


        return;

    }


    selectedRoomInfo.innerHTML = `

        <div class="selected-room-info">

            <h4>
                Room ${room.roomNumber}
            </h4>

            <p>
                ${room.roomType} Room
            </p>

            <p>
                Capacity:
                ${room.capacity} guest(s)
            </p>

            <p>
                ${formatCurrency(room.price)}
                / night
            </p>

        </div>

    `;


    bookingPrice.textContent =
        formatCurrency(
            room.price
        );


    calculateBookingTotal();

}


bookingRoom.addEventListener(
    "change",
    function () {

        updateSelectedRoom();

        resetAvailability();

    }
);


// =====================================================
// BOOKING CALCULATION
// =====================================================

function calculateBookingTotal() {

    const room =
        getSelectedRoom();


    if (!room) {

        bookingNights.textContent =
            "0";

        bookingTotal.textContent =
            "₹0";

        return;

    }


    if (
        !checkInDate.value ||
        !checkOutDate.value
    ) {

        bookingNights.textContent =
            "0";

        bookingTotal.textContent =
            "₹0";

        return;

    }


    const nights =
        calculateNights(
            checkInDate.value,
            checkOutDate.value
        );


    if (nights <= 0) {

        bookingNights.textContent =
            "0";

        bookingTotal.textContent =
            "₹0";

        return;

    }


    const total =
        room.price *
        nights;


    bookingNights.textContent =
        nights;


    bookingTotal.textContent =
        formatCurrency(
            total
        );

}


checkInDate.addEventListener(
    "change",
    function () {

        calculateBookingTotal();

        resetAvailability();

    }
);


checkOutDate.addEventListener(
    "change",
    function () {

        calculateBookingTotal();

        resetAvailability();

    }
);


// =====================================================
// DATE OVERLAP CHECK
// =====================================================

function isRoomAvailable(
    roomNumber,
    requestedCheckIn,
    requestedCheckOut
) {

    const existingBookings =
        bookings.filter(
            booking =>

                booking.roomNumber ===
                roomNumber &&

                booking.status ===
                "CONFIRMED"
        );


    const requestedStart =
        new Date(
            requestedCheckIn
        );


    const requestedEnd =
        new Date(
            requestedCheckOut
        );


    const hasOverlap =
        existingBookings.some(
            booking => {

                const existingStart =
                    new Date(
                        booking.checkIn
                    );


                const existingEnd =
                    new Date(
                        booking.checkOut
                    );


                return (
                    existingStart <
                    requestedEnd &&

                    existingEnd >
                    requestedStart
                );

            }
        );


    return !hasOverlap;

}


// =====================================================
// RESET AVAILABILITY
// =====================================================

function resetAvailability() {

    availabilityMessage.textContent =
        "";

    availabilityMessage.className =
        "availability-message";

    confirmBookingBtn.disabled =
        true;

}


// =====================================================
// CHECK AVAILABILITY
// =====================================================

checkAvailabilityBtn.addEventListener(
    "click",
    function () {

        resetAvailability();


        const room =
            getSelectedRoom();


        if (!room) {

            showAvailabilityError(
                "Please select a room."
            );

            return;

        }


        if (
            !checkInDate.value ||
            !checkOutDate.value
        ) {

            showAvailabilityError(
                "Please select check-in and check-out dates."
            );

            return;

        }


        const nights =
            calculateNights(
                checkInDate.value,
                checkOutDate.value
            );


        if (nights <= 0) {

            showAvailabilityError(
                "Check-out date must be after check-in date."
            );

            return;

        }


        const available =
            isRoomAvailable(
                room.roomNumber,
                checkInDate.value,
                checkOutDate.value
            );


        if (!available) {

            showAvailabilityError(
                "Room is already booked for the selected dates."
            );

            return;

        }


        calculateBookingTotal();


        availabilityMessage.textContent =
            "Room is available for the selected dates.";


        availabilityMessage.className =
            "availability-message availability-success";


        confirmBookingBtn.disabled =
            false;

    }
);


function showAvailabilityError(
    message
) {

    availabilityMessage.textContent =
        message;


    availabilityMessage.className =
        "availability-message availability-error";


    confirmBookingBtn.disabled =
        true;

}


// =====================================================
// CREATE BOOKING
// =====================================================

bookingForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const room =
            getSelectedRoom();


        if (!room) {

            alert(
                "Please select a room."
            );

            return;

        }


        if (!guestName.value.trim()) {

            alert(
                "Guest name is required."
            );

            return;

        }


        if (!guestEmail.value.trim()) {

            alert(
                "Guest email is required."
            );

            return;

        }


        const nights =
            calculateNights(
                checkInDate.value,
                checkOutDate.value
            );


        if (nights <= 0) {

            alert(
                "Check-out date must be after check-in date."
            );

            return;

        }


        if (
            !isRoomAvailable(
                room.roomNumber,
                checkInDate.value,
                checkOutDate.value
            )
        ) {

            alert(
                "Room is no longer available for these dates."
            );

            return;

        }


        const totalAmount =
            room.price *
            nights;


        const newBooking = {

            id:
                bookings.length + 1,

            roomNumber:
                room.roomNumber,

            guestName:
                guestName.value.trim(),

            guestEmail:
                guestEmail.value.trim(),

            checkIn:
                checkInDate.value,

            checkOut:
                checkOutDate.value,

            totalAmount:
                totalAmount,

            status:
                "CONFIRMED",

            createdAt:
                new Date()

        };


        bookings.push(
            newBooking
        );


        alert(
            `Booking confirmed successfully!\n\nBooking ID: #${newBooking.id}`
        );


        bookingForm.reset();


        selectedRoomInfo.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🏨
                </div>

                <p>
                    Select an available room
                    to begin your booking.
                </p>

            </div>

        `;


        bookingPrice.textContent =
            "₹0";


        bookingNights.textContent =
            "0";


        bookingTotal.textContent =
            "₹0";


        resetAvailability();


        renderBookings();

        updateSummary();

        loadHistoryRoomOptions();

        loadBookingRooms();


        scrollToSection(
            "management"
        );

    }
);


// =====================================================
// BOOKING MANAGEMENT
// =====================================================

function renderBookings() {

    bookingTableBody.innerHTML =
        "";


    const searchValue =
        bookingSearch.value
            .toLowerCase()
            .trim();


    const statusValue =
        bookingStatusFilter.value;


    const filteredBookings =
        bookings.filter(
            booking => {

                const matchesSearch =

                    booking.guestName
                        .toLowerCase()
                        .includes(
                            searchValue
                        ) ||

                    booking.roomNumber
                        .toLowerCase()
                        .includes(
                            searchValue
                        );


                const matchesStatus =
                    statusValue === "" ||
                    booking.status ===
                    statusValue;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    if (
        filteredBookings.length === 0
    ) {

        bookingTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="text-align:center;padding:30px;"
                >
                    No bookings found.
                </td>

            </tr>

        `;

        return;

    }


    filteredBookings
        .slice()
        .reverse()
        .forEach(
            booking => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        #${booking.id}
                    </td>

                    <td>
                        Room ${booking.roomNumber}
                    </td>

                    <td>
                        <strong>
                            ${booking.guestName}
                        </strong>
                        <br>
                        <small>
                            ${booking.guestEmail}
                        </small>
                    </td>

                    <td>
                        ${booking.checkIn}
                    </td>

                    <td>
                        ${booking.checkOut}
                    </td>

                    <td>
                        ${formatCurrency(
                            booking.totalAmount
                        )}
                    </td>

                    <td>

                        <span
                            class="booking-status
                            ${booking.status.toLowerCase()}"
                        >
                            ${booking.status}
                        </span>

                    </td>

                    <td>

                        ${
                            booking.status ===
                            "CONFIRMED"

                            ?

                            `
                            <button
                                type="button"
                                class="cancel-booking-btn"
                                onclick="cancelBooking(${booking.id})"
                            >
                                Cancel
                            </button>
                            `

                            :

                            "-"
                        }

                    </td>

                `;


                bookingTableBody.appendChild(
                    row
                );

            }
        );

}


bookingSearch.addEventListener(
    "input",
    renderBookings
);


bookingStatusFilter.addEventListener(
    "change",
    renderBookings
);


// =====================================================
// CANCEL BOOKING
// =====================================================

function cancelBooking(
    bookingId
) {

    const booking =
        bookings.find(
            booking =>
                booking.id ===
                bookingId
        );


    if (!booking) {

        alert(
            "Booking not found."
        );

        return;

    }


    if (
        booking.status !==
        "CONFIRMED"
    ) {

        alert(
            "Only confirmed bookings can be cancelled."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmed) {

        return;

    }


    booking.status =
        "CANCELLED";


    renderBookings();

    updateSummary();


    alert(
        "Booking cancelled successfully."
    );

}


// =====================================================
// BOOKING SUMMARY
// =====================================================

function updateSummary() {

    const total =
        bookings.length;


    const active =
        bookings.filter(
            booking =>
                booking.status ===
                "CONFIRMED"
        ).length;


    const cancelled =
        bookings.filter(
            booking =>
                booking.status ===
                "CANCELLED"
        ).length;


    const revenue =
        bookings
            .filter(
                booking =>
                    booking.status ===
                    "CONFIRMED" ||

                    booking.status ===
                    "COMPLETED"
            )
            .reduce(
                (
                    sum,
                    booking
                ) =>
                    sum +
                    booking.totalAmount,
                0
            );


    totalBookings.textContent =
        total;


    activeBookings.textContent =
        active;


    cancelledBookings.textContent =
        cancelled;


    totalRevenue.textContent =
        formatCurrency(
            revenue
        );

}


// =====================================================
// ROOM BOOKING HISTORY
// =====================================================

function loadHistoryRoomOptions() {

    historyRoomSelect.innerHTML = `

        <option value="">
            Select Room
        </option>

    `;


    rooms.forEach(
        room => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                room.roomNumber;


            option.textContent =
                `Room ${room.roomNumber}`;


            historyRoomSelect.appendChild(
                option
            );

        }
    );

}


historyRoomSelect.addEventListener(
    "change",
    function () {

        const roomNumber =
            historyRoomSelect.value;


        if (!roomNumber) {

            roomHistory.innerHTML = `

                <p class="empty-history">
                    Select a room to view booking history.
                </p>

            `;

            return;

        }


        const roomBookings =
            bookings
                .filter(
                    booking =>
                        booking.roomNumber ===
                        roomNumber
                )
                .slice()
                .sort(
                    (
                        a,
                        b
                    ) =>
                        new Date(
                            b.createdAt
                        ) -
                        new Date(
                            a.createdAt
                        )
                );


        if (
            roomBookings.length === 0
        ) {

            roomHistory.innerHTML = `

                <p class="empty-history">
                    No booking history for this room.
                </p>

            `;

            return;

        }


        roomHistory.innerHTML =
            "";


        roomBookings.forEach(
            booking => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "room-history-item";


                item.innerHTML = `

                    <div class="history-row">

                        <div>

                            <strong>
                                Booking #${booking.id}
                            </strong>

                            <p>
                                ${booking.guestName}
                            </p>

                        </div>


                        <div>

                            <span
                                class="booking-status
                                ${booking.status.toLowerCase()}"
                            >
                                ${booking.status}
                            </span>

                        </div>

                    </div>


                    <p>
                        ${booking.checkIn}
                        →
                        ${booking.checkOut}
                    </p>


                    <strong>
                        ${formatCurrency(
                            booking.totalAmount
                        )}
                    </strong>

                `;


                roomHistory.appendChild(
                    item
                );

            }
        );

    }
);


// =====================================================
// NAVIGATION
// =====================================================

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


navLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            function () {

                navLinks.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                this.classList.add(
                    "active"
                );

            }
        );

    }
);


// =====================================================
// INITIAL LOAD
// =====================================================

displayRooms(
    rooms
);


loadBookingRooms();


loadHistoryRoomOptions();


renderBookings();


updateSummary();