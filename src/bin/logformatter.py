import datetime
import json
import re
import sys

from typing import List


_INCORRECT_LINE_REGEX = r'new payment'


def _print_usage():
	print("logsanitier.py <filepath> [offset] [outpath]")


def _entry_string(entry: object):
	return f"<{entry['timestamp'].seconds // 60}:{(entry['timestamp'].seconds % 60):02d}>: {entry['message']} -> {entry['objects']}"


def _parse_offset(offset_string: str):
	if not offset_string:
		return datetime.timedelta()

	(mins, seconds) = [int(x) for x in offset_string.split(':')]

	return datetime.timedelta(minutes=mins, seconds=seconds)


def _load_entries(filepath: str, offset: datetime.timedelta):
	entries = []
	earliest = None

	quote_sub_re = re.compile(r'\\?\\?\\"')
	incorrect_line_re = re.compile(_INCORRECT_LINE_REGEX)

	with open(filepath, 'r') as f:
		for line in f:
			if len(line) > 1:
				# print(entry)
				sanitized = line[1:-2]
				sanitized = quote_sub_re.sub('"', sanitized)
				# print(sanitized, flush=True)

				if 'new payment' in sanitized:
					sanitized = re.sub(r'\"Added new payment: (.*)","objects":\w?\[\]', '"Added new payment.","objects":[\g<1>]', sanitized)

				try:
					entry = json.loads(sanitized)
				except Exception as e:
					print(entry, sanitized)
					raise e

				if 'date' in entry:
					entry_date = datetime.datetime.fromisoformat(entry['date'].strip("Z"))
					del entry['date']

					if not earliest:
						earliest = entry_date

					entry['timestamp'] = entry_date - earliest + offset

				entries.append(entry)

	return entries


def _write_entries(outpath: str, entries:List[object]):
	with open(outpath, 'w') as f:
		for entry in entries:
			f.write(_entry_string(entry) + "\n")
	print('Wrote entries to', outpath)


def main(argc, argv):
	if argc == 0 or argc > 3:
		print_usage()

	filepath = argv[0]

	offset = datetime.timedelta()
	if len(argv) >= 2:	
		offset = _parse_offset(argv[1])

	entries = _load_entries(filepath, offset)
	# entries = _apply_offset(filepath, offset)

	for entry in entries:
		print(_entry_string(entry))

	print(filepath, offset)

	if len(argv) >= 3:
		_write_entries(argv[2], entries)





if __name__ == '__main__':
	main(len(sys.argv) - 1, sys.argv[1:])