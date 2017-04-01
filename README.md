# Crusader Transport Simulator
Crusader Transport Simulator, a text-based companion for Star Citizen cargo hauling

## Setup
* Download and unzip, or clone CTS
* Install node.js (https://nodejs.org/en/)
* Use npm to install packages `readline-sync` and `sleep`: `npm install sleep` / `npm install readline-sync`
* Type `node index` to run it
* Note: I haven't tested this on a Windows machine (only on OSX), so hopefully it works.

## How to play
* Note: there's no persistence between sessions - if you exit you'll lose your credits and contracts.
* Choose the ship you'd like to use for the session - there's no spawning sequence so you'll have to "land" it at the pad it's spawned at.
* After spawning your ship at Olisar from the terminals, select `Navigation` -> `Port Olisar [...]` -> `[the Strut]` -> `[the specific pad]`
* Check the `Contracts` -> `Available Contracts` menu for a contract to accept.
* To go to your contract pickup location, select the `Take off` menu option, then `Navigation`, then the quantum destinaion, then `Quantum Travel to...`
* To land at your pickup port or dock with your pickup contact, select `Navigation`, then the contact/port, then land/rendezvous.
* Contacts you're rendezvousing with will be between the Comm Array you're at and another Comm Array. To rendezvous with a contact, point at the target Comm Array, and fly towards it until the distance is within 5km of the rendezvous target. Stop your ship, enter the distance, and dock. You can now transfer cargo.
* To transfar cargo with a port, you need to be landed at a pad. For Olisar, you need to be landed at the correct strut. If the automatically assigned pad is not available, you can request a new pad.
* Note: In a future update, the cargo transfer menu will ask you to confirm that the cargo bay doors are open.
* To complete a contract, you need to have picked up all the cargo from the pickup. You can complete it without dropping it all off, but you'll pay a penalty for each undelivered SCU.
* Only a small subset of commodities, employers and contracts are currently available; more will be added in a later update (eg, to and from ICC, Grim Hex, Covalex, and Kareah)
* If your ship is destroyed/lost/stolen, there's no way to signal that in CTS yet, so you'll either need to restart, or "fly" back to Olisar in CTS.

## Future Stuff
* This is just a prototype - ideally it'll run in a web-app or overlaid over Star Citizen (using a DirectX hook).

Happy hauling!

## Gameplay Gfycat
https://gfycat.com/EvergreenUnknownKudu