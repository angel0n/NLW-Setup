export function generateProgressPorcentage(amount: number,completed:number){
    return Math.round((completed / amount)* 100)
}