import getUser from '@/actions/userActions'
import NewPetForm from '@/components/form/NewPetForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import React from 'react'

const PetForm = async() => {
  const user = await getUser();
  if(!user || user?.role === 'SUPER_ADMIN' || user?.role === 'USER'){
    redirect('/')
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Pet</CardTitle>
        <CardDescription>Save Rescue pets details</CardDescription>
      </CardHeader>
      <CardContent>
        <NewPetForm />
      </CardContent>
    </Card>
  )
}

export default PetForm