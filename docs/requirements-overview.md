# App requirements

## Overview.

This app will allow users to view the daily prayer content from any prayer campaign that is hosted on prayer.tools

Users will be able to create a fully customizable reminder that pops up notifications on their device at their selected times.

Clicking on the notification will take the user to that day's prayer content.

## User Journeys

When the user installs the app from the app store, the first screen they see will be a selection of Prayer campaigns from the campaign directory from the prayer.tools API. This gives the user the choice of which campaign to join.

When the user clicks on the app icon on their device, if they have subscribed to a campaign, it will take them straight to the 'Prayer Feed' screen.
If they have not subscribed to a campaign it will take them to the campaign chooser.

From the 'Prayer Feed' screen they can click any day's prayer fuel, which will take them to the 'Prayer Fuel' screen with the chosen day's content loaded.

## Screens

### Campaign chooser

This screen will have a search bar to filter the campaigns by name, and a filter button to filter campaigns by language.

It will have the ability to input a unique campaign code, that will filter the list directly to the campaign that they have the code for.

The campaigns will be grouped into different sections with top level buttons to filter to the campaigns in each group.

The searchable list of campaigns will come from a prayer.tools API directory listing of public campaigns.

Example groupings
* Doxa Life
* 110 Cities
* Ramadan 2026

Example Campaigns
* Pray for the Azeris
* Pray for the Uighur
* Pray for Afghanistan
* Pray for Malaysia
* Pray for Paris
* Pray for London

### Prayer Feed

This page will have some info on their current prayer reminder schedule, as well as a way to edit their reminders.

It will have a list of prayer fuel grouped by day (they may have subscribed to several campaigns). Each item in the list will have the campaign name, a short description of the day's prayer content and a button to go to that days Prayer fuel.

Prayer fuel items that have been marked as "prayed" will be visually indicated with a checkmark (✓) icon and distinct styling to show which days the user has already prayed for.

The prayer fuel contents list will come from a prayer.fuel directory API

### Prayer Fuel

This page will contain the content for the chosen campaign and day.
It will be built from the JSON data given by the prayer.tools endpoint.
The data will first be fetched from the endpoint, and then rendered using blocks such as headings, lists, images, buttons, etc.
There will be a button to share this campaign, and the ability to change language for this campaign.
When the page is opened a prayer.tools API endpoint will be hit to signify the start of the prayer time.
At the bottom of the page content will be a button 'I prayed' which when clicked will hit a prayer.tools API endpoint to signify the end of the prayer time, mark that day's prayer fuel as 'prayed' (with a visual checkmark indicator), and the app will go back to the Prayer Feed screen. If the prayer has already been marked as prayed, the button will display "✓ Prayed" to indicate the status.

### Campaigns

This page will contain a list of the campaigns that the user has subscribed to.
Each campaign will have a kebab menu where they can 'unsubscribe', 'change language', 'share' etc.
There will be a button to allow the user to find a new campaign to subscribe to.
This button will take them to the 'Campaign Chooser' screen.

## UI

There will be a menu allowing the user to click to the 'Prayer fuel' screen, and the 'campaigns' screen.
There will be a button to share the app, as well as the ability to switch language.