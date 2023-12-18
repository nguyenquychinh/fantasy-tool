import type { NextPage } from 'next'
import Layout from '@src/components/Layout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import TableStanding from '@src/components/TableStanding'
import TableTeams from '@src/components/TableTeams'

interface Props {
  data: any
  currentEvent: number
}
//https://cors-anywhere.herokuapp.com/

const Home: NextPage<Props> = ({ data, currentEvent }) => {
  const [standings, setStandings] = useState<any[]>([])
  const [playersPoint, setPlayersPoint] = useState<any[]>([])
  const [membersData, setMembersData] = useState<any>({})
  const [membersTransfer, setMembersTransfer] = useState<any>({})
  const [listEvent, setListEvent] = useState<number[]>([])
  const [selectedEvent, setSelectedEvent] = useState<number>(currentEvent)

  useEffect(() => {
    setSelectedEvent(currentEvent)
    let _list: number[] = []
    for (let i = 1; i <= currentEvent; i++) {
      _list.push(i)
    }
    setListEvent(_list)
  }, [currentEvent])

  useEffect(() => {
    if (data && data.standings) {
      setStandings(data.standings.results)
    } else {
      setStandings([])
    }
  }, [data])

  // fetch data for each member
  useEffect(() => {
    async function fetchDataPlayer() {
      const results: any[] = data.standings.results
      const promiseArr: any[] = []
      for (let item of results) {
        promiseArr.push(axios.get(`/api/entry/${item.entry}/${selectedEvent}/`).then((res) => res.data))
      }
      try {
        const resPickteam = await Promise.all(promiseArr)
        let members: any = {}
        for (let i = 0; i < results.length; i++) {
          const entry = results[i].entry
          members[entry] = resPickteam[i]
        }
        setMembersData(members)
      } catch (err) {
        console.log(err)
      }
    }
    if (data && data.standings && selectedEvent) {
      fetchDataPlayer()
    }
  }, [data, selectedEvent])

  useEffect(() => {
    // get players data
    async function fetchLiveData() {
      const res = await axios.get('/api/live/' + selectedEvent).then((r) => r.data)
      if (Array.isArray(res.elements)) {
        setPlayersPoint(res.elements)
      }
    }
    if (selectedEvent) {
      fetchLiveData()
    }
  }, [selectedEvent])

  // get transfer history
  useEffect(() => {
    async function fetchTransfers() {
      const results: any[] = data.standings.results
      const promiseArr: any[] = []
      for (let item of results) {
        promiseArr.push(axios.get(`/api/entry/${item.entry}/transfer/`).then((res) => res.data))
      }
      try {
        const resTransfer = await Promise.all(promiseArr)
        let transfers: any = {}
        for (let i = 0; i < results.length; i++) {
          const entry = results[i].entry
          transfers[entry] = resTransfer[i]
        }
        setMembersTransfer(transfers)
      } catch (err) {
        console.log(err)
      }
    }

    if (data && data.standings) {
      fetchTransfers()
    }
  }, [data])

  const handleChangeEvent = (_value: number) => {
    setSelectedEvent(_value)
  }

  return (
    <Layout>
      <h1 className={'mt-10 text-center font-bold text-3xl uppercase'}>{data.league.name} league</h1>

      <div className={'flex justify-center items-center gap-4 mt-6'}>
        <span>Select phase:</span>
        <select
          className={'border border-gray-300 py-1 px-2 rounded-lg'}
          value={selectedEvent}
          onChange={(event) => handleChangeEvent(Number(event.target.value))}
        >
          {listEvent.map((evt) => (
            <option key={evt} value={evt}>
              {evt}
            </option>
          ))}
        </select>
      </div>

      <div className={'mt-6 mb-10'}>
        <TableTeams standings={standings} currentEvent={currentEvent} selectedEvent={selectedEvent} />

        <div className={'my-6'} />

        <TableStanding
          standings={standings}
          membersData={membersData}
          membersTransfer={membersTransfer}
          playersPoint={playersPoint}
          currentEvent={currentEvent}
          selectedEvent={selectedEvent}
        />
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  try {
    const res: any = await Promise.all([
      axios.get(`https://fantasy.premierleague.com/api/entry/5377348/`).then((res) => res.data),
      axios.get(`https://fantasy.premierleague.com/api/leagues-classic/${1615217}/standings/`).then((res) => res.data),
    ])
    return {
      props: {
        currentEvent: res[0].current_event,
        data: res[1],
      },
    }
  } catch (err: any) {
    return {
      props: {
        error: { statusCode: 400 },
      },
    }
  }
}

export default Home
