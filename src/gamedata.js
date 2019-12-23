const gamedata = {
  things: [
    {
      noun: "door",
      locationKey: "deck",
      behaviours: ["usePortal"],
      properties: {
        filterActionsTo: ["use"],
        portalTo: "cabin",
        descriptions: {
          default: "A door leading to the cabin."
        }
      }
    },
    {
      noun: "door",
      locationKey: "cabin",
      behaviours: ["usePortal"],
      properties: {
        filterActionsTo: ["use"],
        portalTo: "deck",
        descriptions: {
          default: "A door leading to the deck."
        }
      }
    },
    {
      noun: "cup",
      locationKey: "cabin",
      describedNoun: "golden cup",
      behaviours: ["take"],
      properties: {
        filterActionsTo: ["take", "drop", "examine"],
        stateKey: "initial",
        descriptions: {
          initial: "A small golden cup rests on it's side on the floor.",
          default: "A small golden cup.",
          dropped: "The golden cup you left here sits on the floor."
        },
        details: {
          default: "The {name} is made of plastic... disapointing."
        }
      }
    },
    {
      noun: "book",
      locationKey: "cabin",
      describedNoun: "red book",
      behaviours: ["take"],
      properties: {
        filterActionsTo: ["take", "drop", "examine"],
        descriptions: {
          default: "A shabby red book rests haphazardly on the ground."
        }
      }
    },
    {
      noun: "book",
      locationKey: "cabin",
      describedNoun: "green book",
      behaviours: ["take"],
      properties: {
        filterActionsTo: ["take", "drop", "examine"],
        descriptions: {
          default: "A shabby green book rests haphazardly on the ground."
        }
      }
    },
    {
      noun: "rope",
      locationKey: "deck",
      behaviours: ["take"],
      properties: {
        filterActionsTo: ["take", "drop", "examine"],
        stateKey: "initial",
        descriptions: {
          initial: "A small coil of rope is hung on the wall.",
          default: "A small coil of rope.",
          dropped: "A small coil of rope sits on the floor."
        }
      }
    },
    {
      noun: "rooope",
      locationKey: "deck",
      behaviours: ["take"],
      properties: {
        filterActionsTo: ["take", "drop", "examine"],
        stateKey: "initial",
        descriptions: {
          initial: "A large coil of rooope is hung on the wall.",
          default: "A large coil of rooope.",
          dropped: "A large coil of rooope sits on the floor."
        }
      }
    }
  ],
  locations: [
    {
      key: "cabin",
      noun: "cabin",
      behaviours: ["goTo"],
      properties: {
        descriptions: {
          default: "The engine purrs constantly in the background. "
        }
      }
    },
    {
      key: "deck",
      noun: "deck",
      behaviours: ["goTo"],
      properties: {
        descriptions: {
          default:
            "Waves slap rythmically against the hull of the boat as the water rolls in time of the waves. The deck is sparse."
        }
      }
    }
  ]
};

export default gamedata;
