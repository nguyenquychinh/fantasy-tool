import React, { useEffect, useState } from 'react'
import { DTRAVEL_TEAMS } from '@src/constants'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Tooltip from '@mui/material/Tooltip'

interface Props {
  standings: any[]
}

const TableTeams: React.FC<Props> = ({ standings }) => {
  const [teams, setTeams] = useState<any[]>([])

  useEffect(() => {
    if (standings) {
      let blueTeam: any[] = []
      let redTeam: any[] = []
      for (let item of standings) {
        if (DTRAVEL_TEAMS['BLUE_TEAM'].includes(item.entry)) {
          blueTeam.push(item)
        }
        if (DTRAVEL_TEAMS['RED_TEAM'].includes(item.entry)) {
          redTeam.push(item)
        }

        let _dataTeam: any[] = []
        ;[blueTeam, redTeam].forEach((team, index) => {
          let gw_point = 0
          let total_point = 0
          let players: any[] = []

          team.forEach((player: any) => {
            gw_point += player.event_total
            total_point += player.total
            players.push({
              entry_name: player.entry_name,
              player_name: player.player_name,
              entry: player.entry,
            })
          })
          _dataTeam.push({
            name: index === 0 ? 'Blue team' : 'Red team',
            gw_point,
            total_point,
            players,
          })
        })
        setTeams(_dataTeam.sort((a, b) => b.gw_point - a.gw_point))
      }
    }
  }, [standings])

  return (
    <div>
      <h2 className={'mb-4 px-4 font-medium text-xl'}>Team</h2>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: 'bg-rose-200' }}>Rank</TableCell>
              <TableCell classes={{ root: 'bg-rose-200' }} align="left">
                Team
              </TableCell>
              <TableCell classes={{ root: 'bg-rose-200' }} align="left">
                GW
              </TableCell>
              <TableCell classes={{ root: 'bg-rose-200' }} align="left">
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="left">
                  <Tooltip
                    placement={'right'}
                    arrow
                    enterTouchDelay={150}
                    title={
                      <div>
                        {row.players.map((player: any) => (
                          <p key={player.entry}>
                            <span className={'text-rose-200'}>{player.entry_name}</span> ({player.player_name})
                          </p>
                        ))}
                      </div>
                    }
                  >
                    <span>{row.name}</span>
                  </Tooltip>
                </TableCell>
                <TableCell align="left">{row.gw_point}</TableCell>
                <TableCell align="left">{row.total_point}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default TableTeams
