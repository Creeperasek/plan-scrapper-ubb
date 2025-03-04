import {PlanData} from "@/typings";

export function removeDuplicates<T extends PlanData>(array: T[], key: keyof T): T[] {
    return Array.from(new Map(array.map(item => [item[key], item])).values());
}