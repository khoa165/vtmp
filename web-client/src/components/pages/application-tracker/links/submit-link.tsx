import React, { useState } from 'react';
import { Button } from '@/components/base/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/base/card';
import { Input } from '@/components/base/input';
import { Label } from '@/components/base/label';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Method } from '@/utils/constants';
import { request } from '@/utils/api';
import { SubmitLinkResponseSchema } from '@/components/pages/application-tracker/links/validation';

export const SubmitLink = () => {
  const [linkInput, setLinkInput] = useState('');
  const [submitLinkError, setSubmitLinkError] = useState([]);

  const { mutate: submitLinkFn } = useMutation({
    mutationFn: (body: { url: string }) =>
      request({
        method: Method.POST,
        url: '/links',
        data: body,
        schema: SubmitLinkResponseSchema,
        options: { requireAuth: true },
      }),
    onSuccess: (res) => {
      console.log('Success in useMutation submitLink');
      toast.success(res.message);
      setSubmitLinkError([]);
      setLinkInput('');
    },
    onError: (error) => {
      console.log('Error in useMutation submitLink');
      if (axios.isAxiosError(error) && error.response) {
        const errors = error.response.data.errors.map((e) => e.message);
        setSubmitLinkError(errors);
      } else {
        console.log('Unexpected error', error);
      }
    },
  });

  const handleSubmit = async () => {
    submitLinkFn({ url: linkInput });
  };

  return (
    <div className="grid grid-cols-12 gap-4 px-20 py-15">
      <div className="col-start-1 col-span-5 flex flex-col justify-start">
        <Card className="bg-transparent border-0 h-full justify-center">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Share a Job</CardTitle>
            <CardDescription className="text-2xl">
              Contribute a posting for a job board
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 my-3">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="jobLink" className="pb-2">
                    JobLink
                  </Label>
                  <Input
                    id="url"
                    placeholder="URL"
                    type="url"
                    required
                    value={linkInput}
                    onChange={(e) => {
                      setLinkInput(e.target.value);
                    }}
                    errors={submitLinkError}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="text-black w-full" onClick={handleSubmit}>
              Submit Link
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
