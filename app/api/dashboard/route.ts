import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireActiveStudent, AuthError, ForbiddenError, ConsentRequiredError } from '@/lib/rbac';
import { MoodCheckIn } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await requireActiveStudent();

    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const checkIns = await prisma.moodCheckIn.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: ninetyDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const calculateStats = (records: MoodCheckIn[]) => {
      const count = records.length;
      if (count === 0) {
        return {
          avgMood: null,
          avgStress: null,
          avgEnergy: null,
          avgSleep: null,
          count: 0,
        };
      }

      const sum = records.reduce(
        (acc, curr) => {
          acc.mood += curr.mood;
          if (curr.stress) acc.stress += curr.stress;
          if (curr.energy) acc.energy += curr.energy;
          if (curr.sleep) acc.sleep += curr.sleep;
          
          if (curr.stress) acc.stressCount++;
          if (curr.energy) acc.energyCount++;
          if (curr.sleep) acc.sleepCount++;

          return acc;
        },
        { mood: 0, stress: 0, energy: 0, sleep: 0, stressCount: 0, energyCount: 0, sleepCount: 0 }
      );

      return {
        avgMood: sum.mood / count,
        avgStress: sum.stressCount > 0 ? sum.stress / sum.stressCount : null,
        avgEnergy: sum.energyCount > 0 ? sum.energy / sum.energyCount : null,
        avgSleep: sum.sleepCount > 0 ? sum.sleep / sum.sleepCount : null,
        count,
      };
    };

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const checkIns7d = checkIns.filter((c) => c.createdAt >= sevenDaysAgo);
    const checkIns30d = checkIns.filter((c) => c.createdAt >= thirtyDaysAgo);

    const trends = {
      '7d': calculateStats(checkIns7d),
      '30d': calculateStats(checkIns30d),
      '90d': calculateStats(checkIns),
    };

    return NextResponse.json({ trends });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof ForbiddenError || error instanceof ConsentRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('[DASHBOARD_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
