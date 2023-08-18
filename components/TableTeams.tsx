import React, { useEffect, useState } from 'react'
import { DTRAVEL_TEAMS } from '@src/constants'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { styled } from '@mui/material/styles'

interface Props {
  standings: any[]
  currentEvent?: number
  selectedEvent?: number
}

const TableCellBordered = styled(TableCell)`
  &.MuiTableCell-root {
    //border: 1px solid rgb(17 24 39);
    //font-weight: bold;
  }
`

const TableTeams: React.FC<Props> = ({ standings, currentEvent }) => {
  const [redTeam, setRedTeam] = useState<any>()
  const [blueTeam, setBlueTeam] = useState<any>()

  useEffect(() => {
    console.log('--standings--', standings)
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
      }
      let _dataTeam: any[] = []
      ;[blueTeam, redTeam].forEach((team, index) => {
        let gw_point = 0
        let total_point = 0
        let players: any[] = []

        team.forEach((player: any) => {
          gw_point += player.event_total
          total_point += player.total
          players.push(player)
        })
        _dataTeam.push({
          name: index === 0 ? 'Blue team' : 'Red team',
          gw_point,
          total_point,
          players,
        })
      })
      setBlueTeam(_dataTeam[0])
      setRedTeam(_dataTeam[1])
      // setTeams(_dataTeam.sort((a, b) => b.gw_point - a.gw_point))
    }
  }, [standings])

  console.log('--redTeam--', redTeam)
  console.log('--blueTeam--', blueTeam)

  return (
    <div>
      <h2 className={'mb-4 font-medium text-xl'}>Team</h2>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCellBordered
                classes={{ root: 'bg-red-200' }}
                style={{ width: '40%', fontSize: '20px', fontWeight: 'bold' }}
                align="right"
              >
                <p>Red team</p>
                <p className={'font-light text-base'}>Nhuộm đỏ trời âu</p>
              </TableCellBordered>
              <TableCellBordered
                classes={{ root: 'bg-red-200 text-xl font-bold' }}
                style={{ width: '10%' }}
                align="center"
              >
                {redTeam?.total_point}
              </TableCellBordered>
              <TableCellBordered
                classes={{ root: 'bg-blue-200 text-xl font-bold' }}
                style={{ width: '10%' }}
                align="center"
              >
                {blueTeam?.total_point}
              </TableCellBordered>
              <TableCellBordered
                classes={{ root: 'bg-blue-200' }}
                style={{ width: '40%', fontSize: '20px', fontWeight: 'bold' }}
                align="left"
              >
                <p>Blue team</p>
                <p className={'font-light text-base'}>Anh hàng xóm giàu có</p>
              </TableCellBordered>
            </TableRow>
          </TableHead>
          <TableBody>
            {[0, 1, 2, 3].map((index) => {
              return (
                <TableRow key={index}>
                  <TableCellBordered component="th" scope="row" align={'right'} classes={{ root: 'bg-red-200' }}>
                    <p className={'font-bold'}>
                      {redTeam?.players[index]
                        ? redTeam?.players[index]?.entry_name
                        : index === 2
                        ? 'bithieuhiep'
                        : 'Jacky'}
                    </p>
                    <p>
                      {redTeam?.players[index]
                        ? redTeam?.players[index]?.player_name
                        : index === 2
                        ? 'Dang Nam'
                        : 'Hung Ha'}
                    </p>
                  </TableCellBordered>
                  <TableCellBordered component="th" scope="row" align={'center'} classes={{ root: 'bg-red-200' }}>
                    {redTeam?.players[index]?.event_total}
                  </TableCellBordered>
                  <TableCellBordered component="th" scope="row" align={'center'} classes={{ root: 'bg-blue-200' }}>
                    {blueTeam?.players[index]?.event_total}
                  </TableCellBordered>
                  <TableCellBordered component="th" scope="row" align={'left'} classes={{ root: 'bg-blue-200' }}>
                    <p className={'font-bold'}>
                      {blueTeam?.players[index]
                        ? blueTeam?.players[index]?.entry_name
                        : index === 2
                        ? 'Die Besten'
                        : 'uri'}
                    </p>
                    <p>
                      {blueTeam?.players[index]
                        ? blueTeam?.players[index]?.player_name
                        : index === 2
                        ? 'Duc Le'
                        : 'Cao Hung'}
                    </p>
                  </TableCellBordered>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default TableTeams
