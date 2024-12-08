import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("IssueTicket", function () {
  let issueTicket: any;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let addr2: SignerWithAddress;

  const eventId1 = 1;
  const eventId2 = 2;

  // Sample hashes (in real scenario these would be generated client-side)
  const user1Hash1 = ethers.keccak256(ethers.toUtf8Bytes("user1_identity"));
  const user1Hash2Event1 = ethers.keccak256(ethers.toUtf8Bytes("user1_identity_event1"));
  const user1Hash2Event2 = ethers.keccak256(ethers.toUtf8Bytes("user1_identity_event2"));
  const addr2Hash1 = ethers.keccak256(ethers.toUtf8Bytes("addr2_identity"));
  const addr2Hash2Event1 = ethers.keccak256(ethers.toUtf8Bytes("addr2_identity_event1"));

  beforeEach(async function () {
    [owner, user1, addr2] = await ethers.getSigners();
    const IssueTicketFactory = await ethers.getContractFactory("IssueTicket");
    issueTicket = await IssueTicketFactory.deploy();
    await issueTicket.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const contractOwner = await issueTicket.owner();
      expect(contractOwner).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      const name = await issueTicket.name();
      const symbol = await issueTicket.symbol();
      expect(name).to.equal("EventTicket");
      expect(symbol).to.equal("TCKT");
    });
  });

  describe("Event Management", function () {
    it("Should allow owner to add events", async function () {
      const tx = await issueTicket.addEvent(eventId1);
      const receipt = await tx.wait();
      const eventAddedEvent = receipt.logs.find((e: any) => e.eventName === "EventAdded");
      expect(eventAddedEvent).to.not.be.undefined;
      
      const isValid = await issueTicket.isEventValid(eventId1);
      expect(isValid).to.equal(true);
    });

    it("Should not allow non-owner to add events", async function () {
      const promise = issueTicket.connect(user1).addEvent(eventId1);
      await expect(promise).to.be.revertedWithCustomError(issueTicket, "OwnableUnauthorizedAccount");
    });

    it("Should not allow adding event with ID 0", async function () {
      const promise = issueTicket.addEvent(0);
      await expect(promise).to.be.revertedWith("Invalid event ID");
    });

    it("Should not allow adding duplicate events", async function () {
      await issueTicket.addEvent(eventId1);
      const promise = issueTicket.addEvent(eventId1);
      await expect(promise).to.be.revertedWith("Event already exists");
    });

    it("Should allow owner to remove events", async function () {
      await issueTicket.addEvent(eventId1);
      const tx = await issueTicket.removeEvent(eventId1);
      const receipt = await tx.wait();
      const eventRemovedEvent = receipt.logs.find((e: any) => e.eventName === "EventRemoved");
      expect(eventRemovedEvent).to.not.be.undefined;
      
      const isValid = await issueTicket.isEventValid(eventId1);
      expect(isValid).to.equal(false);
    });

    it("Should not allow removing non-existent events", async function () {
      const promise = issueTicket.removeEvent(eventId1);
      await expect(promise).to.be.revertedWith("Event does not exist");
    });
  });

  describe("Ticket Issuance", function () {
    beforeEach(async function () {
      await issueTicket.addEvent(eventId1);
      await issueTicket.addEvent(eventId2);
    });

    it("Should issue ticket successfully", async function () {
      const tx = await issueTicket.connect(user1).issueTicket(user1Hash1, user1Hash2Event1, eventId1);
      const receipt = await tx.wait();
      const ticketIssuedEvent = receipt.logs.find((e: any) => e.eventName === "TicketIssued");
      expect(ticketIssuedEvent).to.not.be.undefined;

      const hasTicket = await issueTicket.hasTicket(user1Hash2Event1);
      expect(hasTicket).to.equal(true);
      
      const userTickets = await issueTicket.getTicketsByUser(user1Hash1);
      expect(userTickets.length).to.equal(1);
      expect(userTickets[0]).to.equal(1);
    });

    it("Should allow multiple tickets for different events", async function () {
      await issueTicket.connect(user1).issueTicket(user1Hash1, user1Hash2Event1, eventId1);
      await issueTicket.connect(user1).issueTicket(user1Hash1, user1Hash2Event2, eventId2);

      const userTickets = await issueTicket.getTicketsByUser(user1Hash1);
      expect(userTickets.length).to.equal(2);
    });

    it("Should not allow duplicate tickets for same event", async function () {
      await issueTicket.connect(user1).issueTicket(user1Hash1, user1Hash2Event1, eventId1);
      const promise = issueTicket.connect(user1).issueTicket(user1Hash1, user1Hash2Event1, eventId1);
      await expect(promise).to.be.revertedWithCustomError(issueTicket, "TicketAlreadyExists");
    });

    it("Should not allow tickets for invalid events", async function () {
      const promise = issueTicket.connect(user1).issueTicket(user1Hash1, user1Hash2Event1, 999);
      await expect(promise).to.be.revertedWithCustomError(issueTicket, "EventNotActive");
    });

    it("Should not allow tickets with zero hashes", async function () {
      const zeroHash = ethers.ZeroHash;
      const promise1 = issueTicket.connect(user1).issueTicket(zeroHash, user1Hash2Event1, eventId1);
      const promise2 = issueTicket.connect(user1).issueTicket(user1Hash1, zeroHash, eventId1);
      
      await expect(promise1).to.be.revertedWithCustomError(issueTicket, "InvalidHash");
      await expect(promise2).to.be.revertedWithCustomError(issueTicket, "InvalidHash");
    });
  });

  describe("Ticket Queries", function () {
    beforeEach(async function () {
      await issueTicket.addEvent(eventId1);
      await issueTicket.connect(user1).issueTicket(user1Hash1, user1Hash2Event1, eventId1);
    });

    it("Should return correct event ID for ticket", async function () {
      const eventId = await issueTicket.getEventId(1);
      expect(eventId).to.equal(eventId1);
    });

    it("Should return empty array for user with no tickets", async function () {
      const tickets = await issueTicket.getTicketsByUser(addr2Hash1);
      expect(tickets.length).to.equal(0);
    });

    it("Should not allow querying with zero hash", async function () {
      const promise1 = issueTicket.getTicketsByUser(ethers.ZeroHash);
      const promise2 = issueTicket.hasTicket(ethers.ZeroHash);
      
      await expect(promise1).to.be.revertedWithCustomError(issueTicket, "InvalidHash");
      await expect(promise2).to.be.revertedWithCustomError(issueTicket, "InvalidHash");
    });

    it("Should return false for non-existent tickets", async function () {
      const hasTicket = await issueTicket.hasTicket(addr2Hash2Event1);
      expect(hasTicket).to.equal(false);
    });

    it("Should revert for non-existent ticket IDs", async function () {
      const promise = issueTicket.getEventId(999);
      await expect(promise).to.be.revertedWith("Ticket does not exist");
    });
  });
}); 