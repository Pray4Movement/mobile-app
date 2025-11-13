<!-- 889f3da2-8b11-4b46-baed-4a0dea09b8e3 f1cec7d0-7999-46d5-8d0a-13e6b8be7e6d -->
# Flutter Multi-Build Configuration Implementation

## Overview

Implement a configuration-based system to build two app variants (Doxa and General) from a single Flutter codebase with different branding, bundle IDs, and campaign filtering.

**Asset Strategy**: Flutter assets use build-time copying to ensure only the selected variant's assets are included in the final bundle (smaller app size, better security). Android/iOS native resources use flavor-specific directories which are automatically handled by the build system.

## File Structure Changes

### 1. Configuration System

- **Create `lib/config/app_config.dart`**: Base config class with app variant, bundle IDs, campaign filter
- **Create `lib/config/doxa_config.dart`**: Doxa-specific config (variant: 'doxa', filter: 'doxa-life', bundle IDs)
- **Create `lib/config/general_config.dart`**: General app config (variant: 'general', filter: null, bundle IDs)
- **Create `lib/config/config_loader.dart`**: Loads config based on `--dart-define=APP_VARIANT` build argument

### 2. Branding Assets

- **Create `branding/doxa/`**: Icons, splash screens, theme colors
- **Create `branding/general/`**: Icons, splash screens, theme colors
- **Create `branding/current/`**: Build-time destination for selected variant (populated by build scripts)
- **Structure**: `branding/{variant}/icons/`, `branding/{variant}/splash/`, `branding/{variant}/theme.dart`
- **Note**: Flutter assets use build-time copying to `branding/current/` to ensure only selected variant's assets are bundled (prevents including both sets in final app)

### 3. Theme System Updates

- **Modify `lib/theme.dart`**: Load theme from `AppConfig.current.brandingTheme` instead of hardcoded values
- **Create `branding/doxa/theme.dart`**: Doxa color scheme
- **Create `branding/general/theme.dart`**: General app color scheme

### 4. Campaign Filtering

- **Modify `lib/services/data_service.dart`**: Add `getAvailableCampaigns()` method that filters by `AppConfig.current.campaignGroupFilter`
- **Modify `lib/screens/campaign_chooser_screen.dart`**: Use `DataService.getAvailableCampaigns()` instead of `getAllCampaigns()` in `_getFilteredCampaigns()`
- **Modify `lib/data/groups_data.dart`**: Filter groups based on config (only show groups that have campaigns in filtered list)

### 5. App Metadata

- **Modify `lib/main.dart`**:
  - Initialize config at startup
  - Use `AppConfig.current.appName` for MaterialApp title
  - Use config-based theme

### 6. Android Build Configuration

- **Modify `android/app/build.gradle.kts`**:
  - Add product flavors for `doxa` and `general`
  - Set different `applicationId` per flavor
  - Configure resource directories to point to variant-specific assets
- **Create `android/app/src/doxa/res/`**: Doxa-specific Android resources (icons, strings)
- **Create `android/app/src/general/res/`**: General app Android resources
- **Modify `android/app/src/main/AndroidManifest.xml`**: Use placeholder for app name, replaced by flavor

### 7. iOS Build Configuration

- **Modify `ios/Runner.xcodeproj/project.pbxproj`**: Add build configurations for doxa and general
- **Create `ios/Flutter/doxa.xcconfig`**: Doxa-specific Flutter config
- **Create `ios/Flutter/general.xcconfig`**: General app Flutter config
- **Modify `ios/Runner/Info.plist`**: Use build setting variables for bundle ID and app name
- **Create variant-specific asset catalogs**: `ios/Runner/Assets.xcassets/doxa/` and `ios/Runner/Assets.xcassets/general/`

### 8. Build Scripts

- **Create `scripts/copy_branding.sh`**: Helper script that copies variant-specific branding assets to `branding/current/`
  - Takes variant name as argument (doxa or general)
  - Copies `branding/{variant}/*` to `branding/current/`
  - Ensures only selected variant's assets are available during build
- **Create `scripts/build_doxa.sh`**: Build script for Doxa variant
  - Calls `copy_branding.sh doxa` before build
  - Runs Flutter build with `--dart-define=APP_VARIANT=doxa --flavor doxa`
  - Optionally cleans up `branding/current/` after build
- **Create `scripts/build_general.sh`**: Build script for General variant
  - Calls `copy_branding.sh general` before build
  - Runs Flutter build with `--dart-define=APP_VARIANT=general --flavor general`
  - Optionally cleans up `branding/current/` after build
- **Update `README.md`**: Document build commands

## Implementation Details

### Config Loading Pattern

```dart
// lib/config/config_loader.dart
class ConfigLoader {
  static AppConfig load() {
    const variant = String.fromEnvironment('APP_VARIANT', defaultValue: 'general');
    switch (variant) {
      case 'doxa':
        return DoxaConfig();
      case 'general':
      default:
        return GeneralConfig();
    }
  }
}
```

### Campaign Filtering Logic

```dart
// lib/services/data_service.dart
static List<Campaign> getAvailableCampaigns() {
  final allCampaigns = campaigns_data.campaigns;
  final filter = AppConfig.current.campaignGroupFilter;
  if (filter == null) return allCampaigns;
  return allCampaigns.where((c) => c.groupId == filter).toList();
}
```

### Build-Time Asset Copying

Build scripts copy variant-specific assets before Flutter build to ensure only the selected variant's assets are bundled:

```bash
# scripts/copy_branding.sh
#!/bin/bash
VARIANT=$1
rm -rf branding/current
cp -r branding/$VARIANT branding/current
```

### Build Commands

- **Doxa**: `./scripts/build_doxa.sh` (or manually: `./scripts/copy_branding.sh doxa && flutter build apk --dart-define=APP_VARIANT=doxa --flavor doxa`)
- **General**: `./scripts/build_general.sh` (or manually: `./scripts/copy_branding.sh general && flutter build apk --dart-define=APP_VARIANT=general --flavor general`)

## Testing Strategy

- Verify Doxa build only shows 'doxa-life' campaigns
- Verify General build shows all campaigns
- Verify different app names and icons per variant
- Verify different bundle IDs allow both apps on same device
- Test campaign chooser filtering works correctly with config

## Files to Modify

1. `lib/main.dart` - Initialize config, use config values
2. `lib/theme.dart` - Load theme from config
3. `lib/services/data_service.dart` - Add filtering method
4. `lib/screens/campaign_chooser_screen.dart` - Use filtered campaigns
5. `lib/data/groups_data.dart` - Filter groups based on available campaigns
6. `android/app/build.gradle.kts` - Add flavors
7. `ios/Runner.xcodeproj/project.pbxproj` - Add build configs
8. `pubspec.yaml` - Add asset paths for `branding/current/` folder only (not variant-specific folders)

## Files to Create

1. `lib/config/app_config.dart`
2. `lib/config/doxa_config.dart`
3. `lib/config/general_config.dart`
4. `lib/config/config_loader.dart`
5. `branding/doxa/theme.dart`
6. `branding/general/theme.dart`
7. `branding/doxa/icons/` (directory with icon files)
8. `branding/general/icons/` (directory with icon files)
9. `branding/current/` (build-time destination, populated by scripts, added to .gitignore)
10. `android/app/src/doxa/res/` (Android resources)
11. `android/app/src/general/res/` (Android resources)
12. `scripts/copy_branding.sh` (helper script for copying variant assets)
13. `scripts/build_doxa.sh`
14. `scripts/build_general.sh`

### To-dos

- [ ] Create configuration system: app_config.dart base class, doxa_config.dart, general_config.dart, and config_loader.dart that reads APP_VARIANT environment variable
- [ ] Create branding folder structure with doxa/ and general/ subdirectories containing theme.dart files and placeholder directories for icons and splash screens
- [ ] Modify lib/theme.dart to load theme colors from AppConfig.current.brandingTheme instead of hardcoded values
- [ ] Add getAvailableCampaigns() method to DataService that filters campaigns by AppConfig.current.campaignGroupFilter, and update CampaignChooserScreen to use it
- [ ] Update lib/main.dart to initialize AppConfig at startup and use config.appName for MaterialApp title and config-based theme
- [ ] Configure Android build.gradle.kts with product flavors (doxa/general), different applicationIds, and resource directories. Create variant-specific Android resource folders
- [ ] Add iOS build configurations for doxa and general variants, create xcconfig files, and set up variant-specific asset catalogs and Info.plist variables
- [ ] Create build scripts: copy_branding.sh (copies variant assets to branding/current/), build_doxa.sh, and build_general.sh with proper Flutter build commands including --dart-define and --flavor flags
- [ ] Update pubspec.yaml to include asset paths for branding/current/ folder only (not variant-specific folders), ensuring only selected variant's assets are bundled
- [ ] Add branding/current/ to .gitignore since it's a build-time artifact