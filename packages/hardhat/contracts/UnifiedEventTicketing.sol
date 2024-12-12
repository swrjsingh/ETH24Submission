// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract UnifiedEventTicketing is ERC721, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;
    uint256 private _eventIds;

    enum EventStatus { Active, Completed, Cancelled }

    struct EventDetails {
        string name;
        string description;
        string imageCID;
        uint256 startTime;
        uint256 endTime;
        string venueName;
        string streetAddress;
        string city;
        string state;
        string postalCode;
        string country;
        bool isOnline;
        uint256 ticketPrice;
        uint256 maxAttendees;
        bool isPrivate;
    }

    struct Event {
        uint256 eventId;
        address organizer;
        string name;
        string description;
        string imageCID;
        uint256 startTime;
        uint256 endTime;
        string venueName;
        string streetAddress;
        string city;
        string state;
        string postalCode;
        string country;
        bool isOnline;
        uint256 ticketPrice;
        uint256 maxAttendees;
        uint256 ticketsSold;
        EventStatus status;
        bool isPrivate;
    }

    // Mappings
    mapping(uint256 => Event) public events; // Event ID => Event details
    mapping(bytes32 => uint256[]) private userTickets; // Hash1 => array of token IDs (user's tickets)
    mapping(bytes32 => bool) private ticketExists; // Hash2 => bool (track if ticket exists)
    mapping(uint256 => uint256) private ticketToEvent; // Token ID => Event ID
    mapping(uint256 => bool) private validEvents; // Event ID => is valid

    // Events
    event EventCreated(
        uint256 indexed eventId,
        address indexed organizer,
        string name,
        uint256 startTime,
        uint256 endTime,
        uint256 ticketPrice,
        uint256 maxAttendees
    );

    event TicketMinted(
        uint256 indexed eventId,
        uint256 indexed tokenId,
        bytes32 indexed hash2
    );

    event TicketIssued(
        uint256 indexed tokenId,
        uint256 indexed eventId,
        bytes32 indexed hash1
    );

    event EventAdded(uint256 indexed eventId);
    event EventRemoved(uint256 indexed eventId);

    error InvalidEventId(uint256 eventId);
    error TicketAlreadyExists(bytes32 hash2);
    error InvalidHash();
    error EventNotActive(uint256 eventId);
    error TicketNotFound();

    constructor() ERC721("UnifiedEventTicket", "UET") Ownable(msg.sender) {
        _tokenIds = 0;
        _eventIds = 0;
    }

    // Create a new event
    function createEvent(EventDetails calldata details) external returns (uint256) {
        require(details.startTime > block.timestamp, "Start time must be in the future");
        require(details.endTime > details.startTime, "End time must be after start time");
        require(details.maxAttendees > 0, "Max attendees must be greater than 0");

        unchecked {
            _eventIds += 1;
        }
        uint256 eventId = _eventIds;

        events[eventId] = Event({
            eventId: eventId,
            organizer: msg.sender,
            name: details.name,
            description: details.description,
            imageCID: details.imageCID,
            startTime: details.startTime,
            endTime: details.endTime,
            venueName: details.venueName,
            streetAddress: details.streetAddress,
            city: details.city,
            state: details.state,
            postalCode: details.postalCode,
            country: details.country,
            isOnline: details.isOnline,
            ticketPrice: details.ticketPrice,
            maxAttendees: details.maxAttendees,
            ticketsSold: 0,
            status: EventStatus.Active,
            isPrivate: details.isPrivate
        });

        validEvents[eventId] = true;

        emit EventCreated(
            eventId,
            msg.sender,
            details.name,
            details.startTime,
            details.endTime,
            details.ticketPrice,
            details.maxAttendees
        );

        return eventId;
    }

    // Add an event as valid
    function addEvent(uint256 eventId) external onlyOwner {
        require(eventId > 0, "Invalid event ID");
        require(!validEvents[eventId], "Event already exists");
        validEvents[eventId] = true;
        emit EventAdded(eventId);
    }

    // Remove an event
    function removeEvent(uint256 eventId) external onlyOwner {
        require(validEvents[eventId], "Event does not exist");
        validEvents[eventId] = false;
        emit EventRemoved(eventId);
    }

    // Mint a ticket
    function mintTicket(
        uint256 eventId,
        bytes32 hash1,
        bytes32 hash2
    ) external payable nonReentrant returns (uint256) {
        Event storage eventDetails = events[eventId];
        require(eventDetails.eventId != 0, "Event does not exist");
        require(validEvents[eventId], "Event is not active");
        require(eventDetails.status == EventStatus.Active, "Event is not active");
        require(block.timestamp < eventDetails.endTime, "Event has ended");
        require(eventDetails.ticketsSold < eventDetails.maxAttendees, "Event is sold out");
        require(msg.value == eventDetails.ticketPrice, "Incorrect ticket price");
        require(!ticketExists[hash2], "Ticket already exists");

        unchecked {
            _tokenIds += 1;
        }
        uint256 tokenId = _tokenIds;

        _safeMint(msg.sender, tokenId);

        ticketExists[hash2] = true;
        userTickets[hash1].push(tokenId);
        ticketToEvent[tokenId] = eventId;
        eventDetails.ticketsSold++;

        emit TicketMinted(eventId, tokenId, hash2);
        emit TicketIssued(tokenId, eventId, hash1);

        // Transfer payment to organizer
        payable(eventDetails.organizer).transfer(msg.value);

        return tokenId;
    }
    //to ensure non-tranferable NFT tokens.
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            revert("Tickets are non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    // Get tickets owned by a user
    function getTicketsByUser(bytes32 hash1) external view returns (uint256[] memory) {
        if (hash1 == bytes32(0)) revert InvalidHash();
        return userTickets[hash1];
    }

    // Check if a ticket exists
    function hasTicket(bytes32 hash2) external view returns (bool) {
        if (hash2 == bytes32(0)) revert InvalidHash();

        return ticketExists[hash2];
    }

    // Get the event ID for a ticket
    function getEventId(uint256 tokenId) external view returns (uint256) {
        if (_ownerOf(tokenId) == address(0)) revert TicketNotFound();
        return ticketToEvent[tokenId];
    }

    // Check if an event is valid
    function isEventValid(uint256 eventId) external view returns (bool) {
        return validEvents[eventId];
    }
}