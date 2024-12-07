// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreateEvent
 * @dev Contract for creating and managing events
 */
contract CreateEvent is Ownable {
    uint256 private _eventIds;

    enum EventStatus { Active, Completed, Cancelled }

    struct EventDetails {
        uint256 eventId;
        address organizer;
        string name;
        string description;
        uint256 startTime;
        uint256 endTime;
        string venueName;
        string streetAddress;
        string city;
        string state;
        string postalCode;
        string country;
        uint256 ticketPrice;
        uint256 maxAttendees;
        uint256 ticketsSold;
        EventStatus status;
    }

    // Event ID => Event details
    mapping(uint256 => EventDetails) public events;
    // Organizer => Event IDs
    mapping(address => uint256[]) public organizerEvents;

    event EventCreated(
        uint256 indexed eventId,
        address indexed organizer,
        string name,
        uint256 startTime,
        uint256 endTime,
        uint256 ticketPrice,
        uint256 maxAttendees
    );

    event EventCancelled(uint256 indexed eventId);
    event EventCompleted(uint256 indexed eventId);

    constructor() Ownable(msg.sender) {
        _eventIds = 0;
    }

    /**
     * @dev Creates a new event
     * @param name Event name
     * @param description Event description
     * @param startTime Event start time
     * @param endTime Event end time
     * @param venueName Venue name
     * @param streetAddress Street address
     * @param city City
     * @param state State
     * @param postalCode Postal code
     * @param country Country
     * @param ticketPrice Price per ticket in wei
     * @param maxAttendees Maximum number of attendees
     */
    function createEvent(
        string memory name,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        string memory venueName,
        string memory streetAddress,
        string memory city,
        string memory state,
        string memory postalCode,
        string memory country,
        uint256 ticketPrice,
        uint256 maxAttendees
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(startTime > block.timestamp, "Start time must be in the future");
        require(endTime > startTime, "End time must be after start time");
        require(maxAttendees > 0, "Max attendees must be greater than 0");
        require(bytes(venueName).length > 0, "Venue name cannot be empty");

        unchecked {
            _eventIds++;
        }
        uint256 eventId = _eventIds;

        events[eventId] = EventDetails({
            eventId: eventId,
            organizer: msg.sender,
            name: name,
            description: description,
            startTime: startTime,
            endTime: endTime,
            venueName: venueName,
            streetAddress: streetAddress,
            city: city,
            state: state,
            postalCode: postalCode,
            country: country,
            ticketPrice: ticketPrice,
            maxAttendees: maxAttendees,
            ticketsSold: 0,
            status: EventStatus.Active
        });

        organizerEvents[msg.sender].push(eventId);

        emit EventCreated(
            eventId,
            msg.sender,
            name,
            startTime,
            endTime,
            ticketPrice,
            maxAttendees
        );

        return eventId;
    }

    /**
     * @dev Updates ticket sales count for an event
     * @param eventId Event ID
     * @param newTicketsSold New number of tickets sold
     */
    function updateTicketsSold(uint256 eventId, uint256 newTicketsSold) external {
        EventDetails storage eventDetails = events[eventId];
        require(eventDetails.eventId != 0, "Event does not exist");
        require(msg.sender == owner(), "Only owner can update tickets sold");
        require(newTicketsSold <= eventDetails.maxAttendees, "Cannot exceed max attendees");
        
        eventDetails.ticketsSold = newTicketsSold;
    }

    /**
     * @dev Cancels an event
     * @param eventId Event ID
     */
    function cancelEvent(uint256 eventId) external {
        EventDetails storage eventDetails = events[eventId];
        require(eventDetails.eventId != 0, "Event does not exist");
        require(msg.sender == eventDetails.organizer || msg.sender == owner(), "Not authorized");
        require(eventDetails.status == EventStatus.Active, "Event not active");
        
        eventDetails.status = EventStatus.Cancelled;
        emit EventCancelled(eventId);
    }

    /**
     * @dev Completes an event
     * @param eventId Event ID
     */
    function completeEvent(uint256 eventId) external {
        EventDetails storage eventDetails = events[eventId];
        require(eventDetails.eventId != 0, "Event does not exist");
        require(msg.sender == eventDetails.organizer || msg.sender == owner(), "Not authorized");
        require(eventDetails.status == EventStatus.Active, "Event not active");
        require(block.timestamp >= eventDetails.endTime, "Event not ended yet");
        
        eventDetails.status = EventStatus.Completed;
        emit EventCompleted(eventId);
    }

    /**
     * @dev Gets all events created by an organizer
     * @param organizer Address of the organizer
     */
    function getOrganizerEvents(address organizer) external view returns (uint256[] memory) {
        return organizerEvents[organizer];
    }

    /**
     * @dev Gets event details
     * @param eventId Event ID
     */
    function getEventDetails(uint256 eventId) external view returns (EventDetails memory) {
        require(events[eventId].eventId != 0, "Event does not exist");
        return events[eventId];
    }
} 