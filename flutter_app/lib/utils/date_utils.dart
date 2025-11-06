String getDateString(int offset) {
  final date = DateTime.now().add(Duration(days: offset));
  return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
}

String formatDate(String dateString) {
  try {
    final date = DateTime.parse(dateString);
    final months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  } catch (e) {
    return dateString;
  }
}

String formatDateShort(String dateString) {
  try {
    final date = DateTime.parse(dateString);
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${months[date.month - 1]} ${date.day}';
  } catch (e) {
    return dateString;
  }
}

