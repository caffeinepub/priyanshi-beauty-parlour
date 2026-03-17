import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import BookingArray "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    phone : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  type Service = {
    name : Text;
    description : Text;
    price_inr : Nat;
  };

  public type BookingStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  public type Booking = {
    id : Nat;
    customerName : Text;
    phone : Text;
    preferredDate : Text;
    preferredTime : Text;
    serviceName : Text;
    status : BookingStatus;
  };

  // Predefined services catalog
  let services = [
    {
      name = "Bridal Makeup";
      description = "Comprehensive bridal makeup package";
      price_inr = 15000;
    },
    {
      name = "Party Makeup";
      description = "Makeup for parties and events";
      price_inr = 3000;
    },
    {
      name = "Facial";
      description = "Facial treatments for glowing skin";
      price_inr = 1500;
    },
    {
      name = "Hair Cut";
      description = "Professional hair cutting services";
      price_inr = 500;
    },
    {
      name = "Hair Color";
      description = "Hair coloring and highlighting";
      price_inr = 2000;
    },
    {
      name = "Hair Spa";
      description = "Relaxing hair spa treatments";
      price_inr = 1500;
    },
    {
      name = "Threading";
      description = "Eyebrow and facial threading";
      price_inr = 200;
    },
    {
      name = "Waxing";
      description = "Full body and partial waxing";
      price_inr = 1000;
    },
    {
      name = "Mehndi/Henna";
      description = "Traditional henna designs";
      price_inr = 2000;
    },
    {
      name = "Nail Art";
      description = "Creative nail art services";
      price_inr = 800;
    },
    {
      name = "Manicure";
      description = "Nail and hand care treatments";
      price_inr = 600;
    },
    {
      name = "Pedicure";
      description = "Foot and nail care treatments";
      price_inr = 700;
    },
  ];

  var nextBookingId = 1;
  let bookings = Map.empty<Nat, Booking>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public service catalog - no authorization required
  public query ({ caller }) func getServices() : async [Service] {
    services;
  };

  // Public booking submission - no authorization required
  public shared ({ caller }) func submitBooking(
    customerName : Text,
    phone : Text,
    preferredDate : Text,
    preferredTime : Text,
    serviceName : Text,
  ) : async Nat {
    let bookingId = nextBookingId;
    nextBookingId += 1;

    let booking : Booking = {
      id = bookingId;
      customerName;
      phone;
      preferredDate;
      preferredTime;
      serviceName;
      status = #pending;
    };

    bookings.add(bookingId, booking);
    bookingId;
  };

  // Admin-only function to view all bookings
  public query ({ caller }) func getBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view bookings");
    };
    bookings.values().toArray();
  };

  // Admin-only function to update booking status
  public shared ({ caller }) func updateBookingStatus(bookingId : Nat, newStatus : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };

    switch (bookings.get(bookingId)) {
      case (null) {
        Runtime.trap("Booking not found");
      };
      case (?booking) {
        let updatedBooking = { booking with status = newStatus };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };
};
