import { getAdoptionCenterList } from '@/actions/adoptioCeterActios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const AdoptionCenterList = async() => {
    const list = await getAdoptionCenterList()
  return (
    <Card>
        <CardHeader>
            <CardTitle>Adoption center List</CardTitle>
        </CardHeader>
        <CardContent>
            {JSON.stringify(list)}
        </CardContent>
    </Card>
  )
}

export default AdoptionCenterList