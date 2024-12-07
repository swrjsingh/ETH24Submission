import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("CreateEvent", function () {
  let createEvent: any;
  let owner: SignerWithAddress;
  let organizer: SignerWithAddress;
  let addr2: SignerWithAddress;

  // Sample event data
  const sampleEvent = {
    name: "Sample Event",
    description: "A test event",
    startTime: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
    endTime: Math.floor(Date.now() / 1000) + 172800, // 48 hours from now
    venueName: "Test Venue",
    streetAddress: "123 Test St",
    city: "Test City",
    state: "Test State",
    postalCode: "12345",
    country: "Test Country",
    ticketPrice: ethers.parseEther("0.1"),
    maxAttendees: 100,
  };

  beforeEach(async function () {
    [owner, organizer, addr2] = await ethers.getSigners();

    const CreateEventFactory = await ethers.getContractFactory("CreateEvent");
    createEvent = await CreateEventFactory.deploy();
    await createEvent.waitForDeployment();
  });

  describe("Event Creation", function () {
    it("Should create an event with valid parameters", async function () {
      const tx = await createEvent
        .connect(organizer)
        .createEvent(
          sampleEvent.name,
          sampleEvent.description,
          sampleEvent.startTime,
          sampleEvent.endTime,
          sampleEvent.venueName,
          sampleEvent.streetAddress,
          sampleEvent.city,
          sampleEvent.state,
          sampleEvent.postalCode,
          sampleEvent.country,
          sampleEvent.ticketPrice,
          sampleEvent.maxAttendees,
        );

      const receipt = await tx.wait();
      const eventCreatedEvent = receipt.events?.find((e: any) => e.event === "EventCreated");
      expect(Boolean(eventCreatedEvent)).to.equal(true, "Event should be created");

      const eventId = eventCreatedEvent?.args?.eventId;
      const event = await createEvent.events(eventId);

      expect(event.name).to.equal(sampleEvent.name);
      expect(event.organizer).to.equal(organizer.address);
      expect(event.status).to.equal(0); // Active
    });

    it("Should fail with past start time", async function () {
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

      const promise = createEvent
        .connect(organizer)
        .createEvent(
          sampleEvent.name,
          sampleEvent.description,
          pastTime,
          sampleEvent.endTime,
          sampleEvent.venueName,
          sampleEvent.streetAddress,
          sampleEvent.city,
          sampleEvent.state,
          sampleEvent.postalCode,
          sampleEvent.country,
          sampleEvent.ticketPrice,
          sampleEvent.maxAttendees,
        );

      await expect(promise).to.be.revertedWith("Start time must be in the future");
    });

    it("Should fail with end time before start time", async function () {
      const startTime = Math.floor(Date.now() / 1000) + 86400;
      const endTime = startTime - 3600;

      const promise = createEvent
        .connect(organizer)
        .createEvent(
          sampleEvent.name,
          sampleEvent.description,
          startTime,
          endTime,
          sampleEvent.venueName,
          sampleEvent.streetAddress,
          sampleEvent.city,
          sampleEvent.state,
          sampleEvent.postalCode,
          sampleEvent.country,
          sampleEvent.ticketPrice,
          sampleEvent.maxAttendees,
        );

      await expect(promise).to.be.revertedWith("End time must be after start time");
    });
  });

  describe("Event Management", function () {
    let eventId: any;

    beforeEach(async function () {
      const tx = await createEvent
        .connect(organizer)
        .createEvent(
          sampleEvent.name,
          sampleEvent.description,
          sampleEvent.startTime,
          sampleEvent.endTime,
          sampleEvent.venueName,
          sampleEvent.streetAddress,
          sampleEvent.city,
          sampleEvent.state,
          sampleEvent.postalCode,
          sampleEvent.country,
          sampleEvent.ticketPrice,
          sampleEvent.maxAttendees,
        );
      const receipt = await tx.wait();
      const event = receipt.events?.find((e: any) => e.event === "EventCreated");
      eventId = event?.args?.eventId;
    });

    it("Should allow organizer to cancel event", async function () {
      await createEvent.connect(organizer).cancelEvent(eventId);
      const event = await createEvent.events(eventId);
      expect(event.status).to.equal(1); // Cancelled
    });

    it("Should not allow non-organizer to cancel event", async function () {
      const promise = createEvent.connect(addr2).cancelEvent(eventId);
      await expect(promise).to.be.revertedWith("Not authorized");
    });

    it("Should allow owner to update tickets sold", async function () {
      await createEvent.connect(owner).updateTicketsSold(eventId, 50);
      const event = await createEvent.events(eventId);
      expect(event.ticketsSold).to.equal(50);
    });

    it("Should not allow non-owner to update tickets sold", async function () {
      const promise = createEvent.connect(addr2).updateTicketsSold(eventId, 50);
      await expect(promise).to.be.revertedWith("Only owner can update tickets sold");
    });
  });

  describe("Event Queries", function () {
    beforeEach(async function () {
      // Create multiple events
      for (let i = 0; i < 3; i++) {
        await createEvent
          .connect(organizer)
          .createEvent(
            `Event ${i}`,
            sampleEvent.description,
            sampleEvent.startTime,
            sampleEvent.endTime,
            sampleEvent.venueName,
            sampleEvent.streetAddress,
            sampleEvent.city,
            sampleEvent.state,
            sampleEvent.postalCode,
            sampleEvent.country,
            sampleEvent.ticketPrice,
            sampleEvent.maxAttendees,
          );
      }
    });

    it("Should return all events for an organizer", async function () {
      const events = await createEvent.getOrganizerEvents(organizer.address);
      expect(events.length).to.equal(3);
    });

    it("Should return correct event details", async function () {
      const events = await createEvent.getOrganizerEvents(organizer.address);
      const eventDetails = await createEvent.getEventDetails(events[0]);

      expect(eventDetails.name).to.equal("Event 0");
      expect(eventDetails.organizer).to.equal(organizer.address);
    });
  });
});
