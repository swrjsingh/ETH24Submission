// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventTicketing is ERC721, Ownable {
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

    // Event ID => Event details
    mapping(uint256 => Event) public events;
    // Event ID => Hash1 => bool (to track if user has already bought ticket)
    mapping(uint256 => mapping(bytes32 => bool)) public eventTickets;
    // Token ID => Event ID
    mapping(uint256 => uint256) public ticketEventMapping;
    // Hash1 => array of event IDs (for The Graph to index user's events)
    mapping(bytes32 => uint256[]) public userEvents;
    // Hash2 => Token ID
    mapping(bytes32 => uint256) public ticketHashes;

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

    event TicketVerified(
        uint256 indexed eventId,
        uint256 indexed tokenId,
        bytes32 indexed hash2
    );

    constructor() ERC721("EventTicket", "EVTIX") Ownable(msg.sender) {
        _tokenIds = 0;
        _eventIds = 0;
    }

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

    function mintTicket(
        uint256 eventId,
        bytes32 hash1,
        bytes32 hash2
    ) external payable returns (uint256) {
        Event storage eventDetails = events[eventId];
        require(eventDetails.eventId != 0, "Event does not exist");
        require(eventDetails.status == EventStatus.Active, "Event is not active");
        require(block.timestamp < eventDetails.endTime, "Event has ended");
        require(eventDetails.ticketsSold < eventDetails.maxAttendees, "Event is sold out");
        require(msg.value == eventDetails.ticketPrice, "Incorrect ticket price");
        require(!eventTickets[eventId][hash1], "Ticket already purchased");

        unchecked {
            _tokenIds += 1;
        }
        uint256 tokenId = _tokenIds;

        _safeMint(eventDetails.organizer, tokenId);
        
        eventTickets[eventId][hash1] = true;
        ticketEventMapping[tokenId] = eventId;
        ticketHashes[hash2] = tokenId;
        userEvents[hash1].push(eventId);
        eventDetails.ticketsSold++;

        emit TicketMinted(eventId, tokenId, hash2);

        // Transfer payment to organizer
        payable(eventDetails.organizer).transfer(msg.value);

        return tokenId;
    }

    // Override _update to prevent transfers (except minting)
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            revert("Tickets are non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    // View functions for The Graph indexing
    function getEventsByHash1(bytes32 hash1) external view returns (uint256[] memory) {
        return userEvents[hash1];
    }

    function getTokenIdByHash2(bytes32 hash2) external view returns (uint256) {
        return ticketHashes[hash2];
    }
} 