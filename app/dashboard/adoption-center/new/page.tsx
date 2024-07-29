import getUser from '@/actions/userActions'
import NewAdoptionCenterForm from '@/components/form/NewAdoptionCenter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect, RedirectType } from 'next/navigation';
import React from 'react'

const NewAdoptionCenter =async () => {
  const user = await getUser();
  if(!user || user?.role !== 'SUPER_ADMIN'){
    redirect('/',RedirectType.replace)
  }
return (
    <div className=''>
      <Card>
        <CardHeader>
          <CardTitle>Adoption center</CardTitle>
          <CardDescription>Add a new Adoption center</CardDescription>
        </CardHeader>
        <CardContent>
          <NewAdoptionCenterForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default NewAdoptionCenter