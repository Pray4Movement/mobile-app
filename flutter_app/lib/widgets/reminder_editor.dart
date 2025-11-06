import 'package:flutter/material.dart';
import '../models/reminder.dart';
import '../services/data_service.dart';

class ReminderEditor extends StatefulWidget {
  final Reminder? reminder;
  final Function(Reminder) onSave;
  final VoidCallback onCancel;

  const ReminderEditor({
    super.key,
    this.reminder,
    required this.onSave,
    required this.onCancel,
  });

  @override
  State<ReminderEditor> createState() => _ReminderEditorState();
}

class _ReminderEditorState extends State<ReminderEditor> {
  late TextEditingController _timeController;
  final List<String> _daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  final Map<String, bool> _selectedDays = {};
  String? _selectedCampaignId;
  bool _isAllCampaigns = true;

  @override
  void initState() {
    super.initState();
    _timeController = TextEditingController(
      text: widget.reminder?.time ?? '09:00',
    );
    if (widget.reminder != null) {
      for (var day in widget.reminder!.days) {
        _selectedDays[day] = true;
      }
      _selectedCampaignId = widget.reminder!.campaignId;
      _isAllCampaigns = widget.reminder!.campaignId == null;
    } else {
      _isAllCampaigns = true;
    }
  }

  @override
  void dispose() {
    _timeController.dispose();
    super.dispose();
  }

  Future<void> _selectTime() async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (picked != null) {
      setState(() {
        _timeController.text =
            '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}';
      });
    }
  }

  void _save() {
    if (_timeController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a time')),
      );
      return;
    }

    if (_selectedDays.values.every((selected) => !selected)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select at least one day')),
      );
      return;
    }

    final reminder = Reminder(
      id: widget.reminder?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
      time: _timeController.text,
      days: _selectedDays.entries
          .where((e) => e.value)
          .map((e) => e.key)
          .toList(),
      campaignId: _isAllCampaigns ? null : _selectedCampaignId,
    );

    widget.onSave(reminder);
  }

  String _formatDayName(String day) {
    return day[0].toUpperCase() + day.substring(1);
  }

  @override
  Widget build(BuildContext context) {
    // For prototype, show all campaigns
    // In production, this would filter by subscribed campaigns
    final subscribedCampaigns = DataService.getAllCampaigns();

    return Dialog(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 400, maxHeight: 600),
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.reminder == null ? 'New Reminder' : 'Edit Reminder',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            // Time picker
            TextField(
              controller: _timeController,
              decoration: const InputDecoration(
                labelText: 'Time',
                suffixIcon: Icon(Icons.access_time),
              ),
              readOnly: true,
              onTap: _selectTime,
            ),
            const SizedBox(height: 16),
            // Days of week
            Text(
              'Days',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: _daysOfWeek.map((day) {
                final isSelected = _selectedDays[day] ?? false;
                return FilterChip(
                  label: Text(_formatDayName(day)),
                  selected: isSelected,
                  onSelected: (selected) {
                    setState(() {
                      _selectedDays[day] = selected;
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            // Campaign selector
            Text(
              'Campaign',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            RadioListTile<bool>(
              title: const Text('All campaigns'),
              value: true,
              groupValue: _isAllCampaigns,
              onChanged: (value) {
                setState(() {
                  _isAllCampaigns = true;
                  _selectedCampaignId = null;
                });
              },
            ),
            RadioListTile<bool>(
              title: const Text('Specific campaign'),
              value: false,
              groupValue: _isAllCampaigns,
              onChanged: (value) {
                setState(() {
                  _isAllCampaigns = false;
                });
              },
            ),
            if (!_isAllCampaigns) ...[
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _selectedCampaignId,
                decoration: const InputDecoration(
                  labelText: 'Select Campaign',
                  border: OutlineInputBorder(),
                ),
                items: subscribedCampaigns.map((campaign) {
                  return DropdownMenuItem<String>(
                    value: campaign.id,
                    child: Text(campaign.name),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedCampaignId = value;
                  });
                },
              ),
            ],
            const SizedBox(height: 24),
            // Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: widget.onCancel,
                  child: const Text('Cancel'),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _save,
                  child: const Text('Save'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

