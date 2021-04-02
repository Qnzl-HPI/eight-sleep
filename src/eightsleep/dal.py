#!/usr/bin/env python3

from pathlib import PurePath, Path
from typing import List, Dict, Union, Iterator, NamedTuple, Any, Sequence, Optional, Set
import json
from pathlib import Path
from datetime import datetime
import logging

import pytz

from .exporthelpers.dal_helper import PathIsh, Json, Res

def get_logger():
    return logging_helper.logger('8slp')

class DAL:
    def __init__(self, sources: Sequence[PathIsh]) -> None:
        self.sources = [p if isinstance(p, Path) else Path(p) for p in sources]


    def raw(self):
        for f in sorted(self.sources):
            with f.open(encoding="utf-8") as fo:
                yield f, json.load(fo)

    def sessions(self) -> Iterator[Res[Json]]:
      for src in self.sources:
          try:
              j = json.loads(src.read_text())
          except Exception as e:
              ex = RuntimeError(f'While processing {src}')
              ex.__cause__ = e
              yield ex
              continue

          # TODO Dedupe
          for session in j['sessions']:
            yield DAL._parseSession(session)

    def _parseSession(session):
      if 'timeseries' not in session:
        return session

      session['tossAndTurns'] = list()
      for tnt in session['timeseries']['tnt']:
        session['tossAndTurns'].append({
          'timestamp': tnt[0],
          'value': tnt[1]
        })

      session['tempRoomC'] = list()
      for roomC in session['timeseries']['tempRoomC']:
        session['tempRoomC'].append({
          'timestamp': roomC[0],
          'value': roomC[1]
        })

      session['tempBedC'] = list()
      for bedC in session['timeseries']['tempBedC']:
        session['tempBedC'].append({
          'timestamp': bedC[0],
          'value': bedC[1]
        })

      session['respiratoryRate'] = list()
      for rate in session['timeseries']['respiratoryRate']:
        session['respiratoryRate'].append({
          'timestamp': rate[0],
          'value': rate[1]
        })

      session['heartRate'] = list()
      for heartRate in session['timeseries']['heartRate']:
        session['heartRate'].append({
          'timestamp': heartRate[0],
          'value': heartRate[1]
        })

      session['hrv'] = list()
      for hrv in session['timeseries']['hrv']:
        session['hrv'].append({
          'timestamp': hrv[0],
          'value': hrv[1]
        })

      session['rmssd'] = list()
      for rmssd in session['timeseries']['rmssd']:
        session['rmssd'].append({
          'timestamp': rmssd[0],
          'value': rmssd[1]
        })

      return session

if __name__ == '__main__':
    dal_helper.main(DAL=DAL)
