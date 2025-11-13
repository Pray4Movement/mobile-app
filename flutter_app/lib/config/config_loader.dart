import 'app_config.dart';
import 'doxa_config.dart';
import 'general_config.dart';

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

