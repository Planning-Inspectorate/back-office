#!/bin/bash

npm run db:migrate

npm run prisma-generate

npm run dev
