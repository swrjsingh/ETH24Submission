// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IssueTicket
 * @dev NFT-based ticket issuance system with privacy-preserving user identification
 */
contract IssueTicket is ERC721, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId;

    // Mapping from Hash1 (user identity hash) to their ticket tokenIds
    mapping(bytes32 => uint256[]) private userTickets;
    
    // Mapping from Hash2 (user+event hash) to check if ticket exists
    mapping(bytes32 => bool) private ticketExists;
    
    // Mapping from tokenId to eventId
    mapping(uint256 => uint256) private ticketToEvent;

    // Mapping to track valid event IDs
    mapping(uint256 => bool) private validEvents;

    event TicketIssued(uint256 indexed tokenId, uint256 indexed eventId, bytes32 indexed hash1);
    event EventAdded(uint256 indexed eventId);
    event EventRemoved(uint256 indexed eventId);

    error InvalidEventId(uint256 eventId);
    error TicketAlreadyExists(bytes32 hash2);
    error InvalidHash();
    error EventNotActive(uint256 eventId);
    error TicketNotFound();

    constructor() ERC721("EventTicket", "TCKT") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    /**
     * @dev Adds a new event to the system
     * @param eventId ID of the event to add
     */
    function addEvent(uint256 eventId) external onlyOwner {
        require(eventId > 0, "Invalid event ID");
        require(!validEvents[eventId], "Event already exists");
        validEvents[eventId] = true;
        emit EventAdded(eventId);
    }

    /**
     * @dev Removes an event from the system
     * @param eventId ID of the event to remove
     */
    function removeEvent(uint256 eventId) external onlyOwner {
        require(validEvents[eventId], "Event does not exist");
        validEvents[eventId] = false;
        emit EventRemoved(eventId);
    }

    /**
     * @dev Issues a new ticket NFT
     * @param hash1 Hash of user's identity (aadhar+credit+cvv)
     * @param hash2 Hash of user's identity + eventId
     * @param eventId ID of the event
     * @return tokenId The ID of the minted NFT ticket
     */
    function issueTicket(
        bytes32 hash1, 
        bytes32 hash2, 
        uint256 eventId
    ) external nonReentrant returns (uint256) {
        // Input validation
        if (hash1 == bytes32(0) || hash2 == bytes32(0)) revert InvalidHash();
        if (!validEvents[eventId]) revert EventNotActive(eventId);
        if (ticketExists[hash2]) revert TicketAlreadyExists(hash2);
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        
        ticketExists[hash2] = true;
        userTickets[hash1].push(tokenId);
        ticketToEvent[tokenId] = eventId;
        
        emit TicketIssued(tokenId, eventId, hash1);
        
        return tokenId;
    }

    /**
     * @dev Gets all tickets owned by a user
     * @param hash1 Hash of user's identity
     * @return Array of token IDs owned by the user
     */
    function getTicketsByUser(bytes32 hash1) external view returns (uint256[] memory) {
        if (hash1 == bytes32(0)) revert InvalidHash();
        return userTickets[hash1];
    }

    /**
     * @dev Checks if a user has a ticket for an event
     * @param hash2 Hash of user's identity + eventId
     * @return bool indicating if the ticket exists
     */
    function hasTicket(bytes32 hash2) external view returns (bool) {
        if (hash2 == bytes32(0)) revert InvalidHash();
        return ticketExists[hash2];
    }

    /**
     * @dev Gets the event ID for a ticket
     * @param tokenId ID of the ticket
     * @return eventId
     */
    function getEventId(uint256 tokenId) external view returns (uint256) {
        if (_ownerOf(tokenId) == address(0)) revert TicketNotFound();
        return ticketToEvent[tokenId];
    }

    /**
     * @dev Checks if an event is valid and active
     * @param eventId ID of the event
     * @return bool indicating if the event is valid
     */
    function isEventValid(uint256 eventId) external view returns (bool) {
        return validEvents[eventId];
    }
} 