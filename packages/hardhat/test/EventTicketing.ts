import { expect } from "chai";
import { ethers } from "hardhat";
import type { EventTicketing } from "../typechain-types/contracts/EventTicketing";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { parseEther } from "ethers";
import { createHash } from "crypto";

describe("EventTicketing", function () {
  let eventTicketing: EventTicketing;
  let owner: SignerWithAddress;
  let organizer: SignerWithAddress;
  let attendee: SignerWithAddress;
  let addrs: SignerWithAddress[];

  // Helper function to create SHA256 hash
  function sha256(input: string): string {
    return "0x" + createHash("sha256").update(input).digest("hex");
  }

  // Sample event data
  const eventData = {
    name: "Test Event",
    description: "A test event description",
    imageCID: "QmTest123",
    startTime: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    endTime: Math.floor(Date.now() / 1000) + 7200, // 2 hours from now
    venueName: "Test Venue",
    streetAddress: "123 Test St",
    city: "Test City",
    state: "Test State",
    postalCode: "12345",
    country: "Test Country",
    isOnline: false,
    ticketPrice: parseEther("0.1"),
    maxAttendees: 100,
    isPrivate: false,
  };

  beforeEach(async function () {
    [owner, organizer, attendee, ...addrs] = await ethers.getSigners();

    const EventTicketing = await ethers.getContractFactory("EventTicketing");
    eventTicketing = (await EventTicketing.deploy()) as any as EventTicketing;
    await eventTicketing.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await eventTicketing.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await eventTicketing.name()).to.equal("EventTicket");
      expect(await eventTicketing.symbol()).to.equal("EVTIX");
    });
  });

  describe("Event Creation", function () {
    it("Should create an event with correct parameters", async function () {
      await expect(eventTicketing.connect(organizer).createEvent(eventData))
        .to.emit(eventTicketing, "EventCreated")
        .withArgs(
          1, // eventId
          organizer.address,
          eventData.name,
          eventData.startTime,
          eventData.endTime,
          eventData.ticketPrice,
          eventData.maxAttendees,
        );

      const event = await eventTicketing.events(1);
      expect(event.name).to.equal(eventData.name);
      expect(event.organizer).to.equal(organizer.address);
      expect(event.ticketPrice).to.equal(eventData.ticketPrice);
    });

    it("Should fail if end time is before start time", async function () {
      const invalidEventData = {
        ...eventData,
        endTime: eventData.startTime - 1,
      };
      await expect(eventTicketing.connect(organizer).createEvent(invalidEventData)).to.be.revertedWith(
        "End time must be after start time",
      );
    });
  });

  describe("Ticket Minting", function () {
    let eventId: number;
    // Using SHA256 for hashing
    const userSecret = JSON.stringify({
      aadhar: "123456789012",
      credit: "4111111111111111",
      cvv: "123",
    });
    const hash1 = sha256(userSecret);
    const hash2 = sha256(hash1 + "1"); // hash1 + eventId

    beforeEach(async function () {
      await eventTicketing.connect(organizer).createEvent(eventData);
      eventId = 1;
    });

    it("Should mint ticket with correct payment", async function () {
      await expect(eventTicketing.connect(attendee).mintTicket(eventId, hash1, hash2, { value: eventData.ticketPrice }))
        .to.emit(eventTicketing, "TicketMinted")
        .withArgs(eventId, 1, hash2);

      expect(await eventTicketing.getTokenIdByHash2(hash2)).to.equal(1);
      const userEventsList = await eventTicketing.getEventsByHash1(hash1);
      expect(userEventsList[0]).to.equal(eventId);
    });

    it("Should fail if incorrect payment amount", async function () {
      const incorrectPrice = eventData.ticketPrice - 1n;
      await expect(
        eventTicketing.connect(attendee).mintTicket(eventId, hash1, hash2, { value: incorrectPrice }),
      ).to.be.revertedWith("Incorrect ticket price");
    });

    it("Should fail if event is sold out", async function () {
      const smallEventData = { ...eventData, maxAttendees: 1 };
      await eventTicketing.connect(organizer).createEvent(smallEventData);

      const newEventId = 2;
      await eventTicketing.connect(attendee).mintTicket(newEventId, hash1, hash2, { value: eventData.ticketPrice });

      // Different user trying to buy ticket
      const user2Secret = JSON.stringify({
        aadhar: "987654321098",
        credit: "4111111111111112",
        cvv: "456",
      });
      const hash1_2 = sha256(user2Secret);
      const hash2_2 = sha256(hash1_2 + "2"); // hash1_2 + eventId

      await expect(
        eventTicketing.connect(addrs[0]).mintTicket(newEventId, hash1_2, hash2_2, { value: eventData.ticketPrice }),
      ).to.be.revertedWith("Event is sold out");
    });
  });

  describe("Ticket Transfers", function () {
    it("Should not allow ticket transfers", async function () {
      await eventTicketing.connect(organizer).createEvent(eventData);

      const userSecret = JSON.stringify({
        aadhar: "123456789012",
        credit: "4111111111111111",
        cvv: "123",
      });
      const hash1 = sha256(userSecret);
      const hash2 = sha256(hash1 + "1"); // hash1 + eventId

      await eventTicketing.connect(attendee).mintTicket(1, hash1, hash2, { value: eventData.ticketPrice });

      const tokenId = 1;
      await expect(
        eventTicketing.connect(organizer).transferFrom(organizer.address, attendee.address, tokenId),
      ).to.be.revertedWith("Tickets are non-transferable");

      await expect(
        eventTicketing
          .connect(organizer)
          ["safeTransferFrom(address,address,uint256)"](organizer.address, attendee.address, tokenId),
      ).to.be.revertedWith("Tickets are non-transferable");
    });
  });
});
