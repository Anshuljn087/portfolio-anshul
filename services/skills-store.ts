import type { Skill } from '@prisma/client'
import type { SkillInput } from '@/services/repositories/types'
import { skillRepository } from '@/services/repositories/skill-repository'

export async function listSkills(): Promise<Skill[]> {
  return skillRepository.findMany()
}

export async function getSkill(id: string): Promise<Skill | null> {
  return skillRepository.findById(id)
}

export async function createSkill(values: SkillInput): Promise<Skill> {
  return skillRepository.create(values)
}

export async function updateSkill(id: string, values: SkillInput): Promise<Skill> {
  return skillRepository.update(id, values)
}

export async function deleteSkill(id: string): Promise<Skill> {
  return skillRepository.softDelete(id)
}
